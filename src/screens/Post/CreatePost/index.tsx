import React, {FC, useEffect, useRef} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Button from '~/beinComponents/Button';
import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import appConfig from '~/configs/appConfig';
import {useBaseHook} from '~/hooks';
import {useBackPressListener, useRootNavigation} from '~/hooks/navigation';
import {IAudience, ICreatePostParams} from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/HomeStack/stack';
import ImportantStatus from '~/screens/Post/components/ImportantStatus';
import useCreatePost from '~/screens/Post/CreatePost/hooks/useCreatePost';
import postActions from '~/screens/Post/redux/actions';
import {ITheme} from '~/theme/interfaces';
import CreatePostChosenAudiences from '../components/CreatePostChosenAudiences';
import CreatePostContent from './components/CreatePostContent';
import CreatePostFooter from './components/CreatePostFooter';
import {handleBack} from './handler';

export interface CreatePostProps {
  route?: {
    params?: ICreatePostParams;
  };
}

const CreatePost: FC<CreatePostProps> = ({route}: CreatePostProps) => {
  const toolbarRef = useRef<any>();
  const mentionInputRef = useRef<any>();
  const screenParams = route?.params || {};

  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = themeStyles(theme);
  const refTextInput = useRef<any>();

  const useCreatePostData = useCreatePost({
    screenParams,
    mentionInputRef,
  });
  const {
    refIsRefresh,
    sPostData,
    createPostData,
    images,
    video,
    files,
    videoUploading,
    disableButtonPost,
    isEditPost,
    isEditDraftPost,
    isEditPostHasChange,
    handlePressPost,
    isNewsfeed,
  } = useCreatePostData;

  const {
    loading,
    data,
    chosenAudiences = [],
    important,
    count,
  } = createPostData || {};
  const {content} = data || {};

  const groupIds: any[] = [];
  chosenAudiences.map((selected: IAudience) => {
    if (selected.type !== 'user') {
      groupIds.push(selected.id);
    }
  });

  const sPostId = sPostData?.id;
  const isEdit = !!(sPostId && !sPostData?.isDraft);

  let imageDisabled, fileDisabled, videoDisabled;

  if (video) {
    videoDisabled = true;
    imageDisabled = true;
    fileDisabled = true;
  } else if (images?.length > 0) {
    videoDisabled = true;
    fileDisabled = true;
  } else if (files?.length > 0) {
    videoDisabled = true;
    imageDisabled = true;
  }

  if (files.length === appConfig.maxFiles) fileDisabled = true;

  const handleBackPress = () => {
    toolbarRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  useEffect(() => {
    // disable clear data for flow select audience before create post
    // dispatch(postActions.clearCreatPostData());
    // dispatch(postActions.setSearchResultAudienceGroups([]));
    // dispatch(postActions.setSearchResultAudienceUsers([]));
    if (screenParams?.initAudience?.id) {
      dispatch(
        postActions.setCreatePostChosenAudiences(
          new Array(screenParams?.initAudience),
        ),
      );
    }
    return () => {
      dispatch(postActions.clearCreatPostData());
      dispatch(postActions.setSearchResultAudienceGroups([]));
      dispatch(postActions.setSearchResultAudienceUsers([]));
      dispatch(postActions.setCreatePostImagesDraft([]));

      //clear comment because of comment input view listen emit event change text
      dispatch(postActions.setCreateComment({content: '', loading: false}));
    };
  }, []);

  useEffect(() => {
    if (content && !mentionInputRef?.current?.getContent?.()) {
      mentionInputRef?.current?.setContent?.(content);
    }
  }, [content, images]);

  const onPressBack = () => {
    handleBack(
      !!(isEditPost && !isEditDraftPost),
      isEditPostHasChange,
      !!(sPostId && refIsRefresh.current),
      videoUploading,
      video,
      theme,
      rootNavigation,
      dispatch,
      isNewsfeed,
      onPressDraftPost,
    );
  };

  const onPressDraftPost = () => {
    if (isNewsfeed) {
      dispatch(postActions.getDraftPosts({isRefresh: true}));
      rootNavigation.navigate(homeStack.draftPost);
    }
  };

  const onPressPost = async () => {
    handlePressPost();
  };

  const onPressSettings = () => {
    rootNavigation.navigate(homeStack.postSettings);
  };

  const onPressInput = () => {
    refTextInput.current?.setFocus();
  };

  return (
    <ScreenWrapper isFullView testID={'CreatePostScreen'}>
      <Header
        titleTextProps={{useI18n: true}}
        title={isEdit ? 'post:title_edit_post' : 'post:title_create_post'}
        buttonText={isEdit ? 'common:btn_publish' : 'post:post_button'}
        buttonProps={{
          loading: loading,
          disabled: disableButtonPost,
          useI18n: true,
          highEmphasis: true,
          style: {borderWidth: 0},
          testID: 'create_post.btn_post',
        }}
        onPressBack={onPressBack}
        onPressButton={onPressPost}
      />
      <TouchableOpacity
        style={styles.flex1}
        onPress={onPressInput}
        activeOpacity={1}>
        <View>
          {!!important?.active && <ImportantStatus notExpired />}
          <CreatePostChosenAudiences disabled={loading} />
          <Divider />
        </View>
        <CreatePostContent
          groupIds={groupIds}
          inputRef={refTextInput}
          useCreatePostData={useCreatePostData}
        />
        <View style={styles.setting}>
          <Button.Secondary
            testID="create_post.btn_post_settings"
            color={colors.bgHover}
            leftIcon="SlidersVAlt"
            style={styles.buttonSettings}
            onPress={onPressSettings}
            textProps={{color: colors.textPrimary, style: {fontSize: 14}}}>
            {t('post:settings') + (count > 0 ? ` (${count})` : '')}
          </Button.Secondary>
        </View>
        <CreatePostFooter
          toolbarRef={toolbarRef}
          loading={loading}
          onPressBack={onPressBack}
          imageDisabled={imageDisabled}
          videoDisabled={videoDisabled}
          fileDisabled={fileDisabled}
        />
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    flex1: {flex: 1},
    container: {
      flex: 1,
    },
    setting: {
      padding: spacing?.padding.large,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
    },
    buttonSettings: {
      backgroundColor: colors.bgHover,
      borderRadius: spacing.borderRadius.small,
    },
  });
};

export default CreatePost;
