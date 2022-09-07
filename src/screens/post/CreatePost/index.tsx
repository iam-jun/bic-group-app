import React, { FC, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import appConfig from '~/configs/appConfig';
import { useBaseHook } from '~/hooks';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { IAudience, ICreatePostParams } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import useCreatePost from '~/screens/post/CreatePost/hooks/useCreatePost';
import postActions from '~/storeRedux/post/actions';

import spacing from '~/theme/spacing';
import CreatePostChosenAudiences from '../components/CreatePostChosenAudiences';
import { getTotalFileSize } from '../../../storeRedux/post/selectors';
import CreatePostContent from './components/CreatePostContent';
import CreatePostFooter from './components/CreatePostFooter';
import CreatePostBannerImportant from './components/CreatePostBannerImportant';
import { handleBack } from './handler';
import useDraftPostStore from '../DraftPost/store';

export interface CreatePostProps {
  route?: {
    params?: ICreatePostParams;
  };
}

const CreatePost: FC<CreatePostProps> = ({ route }: CreatePostProps) => {
  const toolbarRef = useRef<any>();
  const mentionInputRef = useRef<any>();
  const screenParams = route?.params || {};

  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);
  const refTextInput = useRef<any>();

  const { doGetDraftPosts } = useDraftPostStore();

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
  const { content } = data || {};
  const { totalFiles, totalSize } = getTotalFileSize();

  const groupIds: any[] = [];
  chosenAudiences.forEach((selected: IAudience) => {
    if (selected.type !== 'user') {
      groupIds.push(selected.id);
    }
  });

  const sPostId = sPostData?.id;
  const isEdit = !!(sPostId && !sPostData?.isDraft);

  let imageDisabled; let fileDisabled; let
    videoDisabled;

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

  if (
    totalFiles === appConfig.maxFiles
    || totalSize >= appConfig.totalFileSize
  ) {
    fileDisabled = true;
  }

  const handleBackPress = () => {
    toolbarRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  useEffect(
    () => {
    // disable clear data for flow select audience before create post
    // dispatch(postActions.clearCreatPostData());
      if (screenParams?.initAudience?.id) {
        dispatch(postActions.setCreatePostChosenAudiences(new Array(screenParams?.initAudience)));
      }
      return () => {
        dispatch(postActions.clearCreatPostData());
        dispatch(postActions.setCreatePostImagesDraft([]));

        // clear comment because of comment input view listen emit event change text
        dispatch(postActions.setCreateComment({ content: '', loading: false }));
      };
    }, [],
  );

  useEffect(
    () => {
      if (content && !mentionInputRef?.current?.getContent?.()) {
        mentionInputRef?.current?.setContent?.(content);
      }
    }, [content, images],
  );

  const onPressBack = () => {
    handleBack(
      !!(isEditPost && !isEditDraftPost),
      isEditPostHasChange,
      !!(sPostId && refIsRefresh.current),
      theme,
      rootNavigation,
      dispatch,
      isNewsfeed,
      onPressDraftPost,
    );
  };

  const onPressDraftPost = () => {
    if (isNewsfeed) {
      doGetDraftPosts({ isRefresh: true });
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

  const now = new Date();
  const notExpired = now.getTime() < new Date(important?.expires_time).getTime();

  return (
    <ScreenWrapper isFullView testID="CreatePostScreen">
      <Header
        titleTextProps={{ useI18n: true }}
        title={isEdit ? 'post:title_edit_post' : 'post:title_create_post'}
        buttonText={isEdit ? 'post:save' : 'common:btn_publish'}
        buttonProps={{
          loading,
          disabled: disableButtonPost,
          useI18n: true,
          style: { borderWidth: 0 },
          testID: 'create_post.btn_post',
        }}
        onPressBack={onPressBack}
        onPressButton={onPressPost}
        style={styles.headerStyle}
      />
      <View style={styles.flex1}>
        <View>
          {!!important?.active && notExpired && <CreatePostBannerImportant expiresTime={important.expires_time} />}
          <CreatePostChosenAudiences disabled={loading} />
          <Divider color={theme.colors.neutral5} />
        </View>
        <CreatePostContent
          groupIds={groupIds}
          inputRef={refTextInput}
          useCreatePostData={useCreatePostData}
        />
        <CreatePostFooter
          toolbarRef={toolbarRef}
          loading={loading}
          onPressBack={onPressBack}
          imageDisabled={imageDisabled}
          videoDisabled={videoDisabled}
          fileDisabled={fileDisabled}
          onPressSetting={onPressSettings}
          isSetting={count > 0}
        />
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    flex1: { flex: 1 },
    container: {
      flex: 1,
    },
    setting: {
      padding: spacing.padding.large,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexWrap: 'wrap',
    },
    buttonSettings: {
      backgroundColor: colors.gray5,
      borderRadius: spacing.borderRadius.small,
    },
    headerStyle: {
      borderBottomColor: colors.neutral5,
      borderBottomWidth: 1,
    },
  });
};

export default CreatePost;
