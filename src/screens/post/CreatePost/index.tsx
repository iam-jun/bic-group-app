import React, { FC, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import appConfig from '~/configs/appConfig';
import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import { IAudience, ICreatePostParams } from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import useCreatePost from '~/screens/post/CreatePost/hooks/useCreatePost';
import postActions from '~/storeRedux/post/actions';

import spacing from '~/theme/spacing';
import CreatePostChosenAudiences from '../../../components/posts/CreatePostChosenAudiences';
import { getTotalFileSize } from '~/storeRedux/post/selectors';
import CreatePostContent from './components/CreatePostContent';
import CreatePostFooter from './components/CreatePostFooter';
import CreatePostBannerImportant from './components/CreatePostBannerImportant';
import { handleBack } from './handler';
import useDraftPostStore from '../../Draft/DraftPost/store';
import useCommentInputStore from '../../comments/components/CommentInputView/store';
import ICommentInputState from '../../comments/components/CommentInputView/store/Interface';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import useMyPermissionsStore from '~/store/permissions';
import { PermissionKey } from '~/constants/permissionScheme';
import { useBaseHook } from '~/hooks';
import modalActions from '~/storeRedux/modal/actions';
import Text from '~/baseComponents/Text';

export interface CreatePostProps {
  route?: {
    params?: ICreatePostParams;
  };
}

const CreatePost: FC<CreatePostProps> = ({ route }: CreatePostProps) => {
  const toolbarRef = useRef<any>();
  const mentionInputRef = useRef<any>();
  const screenParams = route?.params || {};

  const actions = useCommentInputStore((state: ICommentInputState) => state.actions);

  const dispatch = useDispatch();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const refTextInput = useRef<any>();

  const { actions: draftPostActions } = useDraftPostStore();

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

  const { getAudienceListWithNoPermission } = useMyPermissionsStore((state) => state.actions);

  const audienceListWithNoPermission = getAudienceListWithNoPermission(
    chosenAudiences,
    PermissionKey.EDIT_POST_SETTING,
  );
  const shouldDisablePostSettings = audienceListWithNoPermission.length === chosenAudiences.length;

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
        actions.setCreateComment({ content: '', loading: false });
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
      draftPostActions.getDraftPosts({ isRefresh: true });
      rootNavigation.navigate(menuStack.draft);
    }
  };

  const onPressPost = async () => {
    handlePressPost();
  };

  const onPressSettings = () => {
    if (audienceListWithNoPermission.length > 0) {
      const audienceListNames = audienceListWithNoPermission.map((audience) => audience.name).join(', ');
      const alertPayload = {
        title: t('post:post_setting_permissions_alert:title'),
        children: (
          <Text.BodyM style={styles.childrenText}>
            {t('post:post_setting_permissions_alert:description_1')}
            <Text.BodyMMedium>{audienceListNames}</Text.BodyMMedium>
            {t('post:post_setting_permissions_alert:description_2')}
          </Text.BodyM>
        ),
        onConfirm: null,
        cancelBtn: true,
      };
      dispatch(modalActions.showAlert(alertPayload));
      return;
    }

    rootNavigation.navigate(homeStack.postSettings);
  };

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
          {!!important?.active && <CreatePostBannerImportant expiresTime={important.expiresTime} />}
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
          settingDisabled={shouldDisablePostSettings}
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
    childrenText: {
      paddingTop: spacing.padding.tiny,
      paddingBottom: spacing.padding.base,
      paddingHorizontal: spacing.padding.large,
    },
  });
};

export default CreatePost;
