import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import { useBackPressListener, useRootNavigation } from '~/hooks/navigation';
import {
  IAudience,
  ICreatePostParams,
  IPostCreatePost,
} from '~/interfaces/IPost';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';

import spacing from '~/theme/spacing';
import CreatePostChosenAudiences from '../../../components/posts/CreatePostChosenAudiences';
import CreatePostContent from './components/CreatePostContent';
import CreatePostFooter from './components/CreatePostFooter';
import CreateBannerImportant from '~/components/ImportantSettings/CreateBannerImportant';
import { handleBack } from './handler';
import useDraftPostStore from '../../YourContent/components/Draft/DraftPost/store';
import useCommentInputStore from '../../comments/components/CommentInputView/store';
import ICommentInputState from '../../comments/components/CommentInputView/store/Interface';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import useModalStore from '~/store/modal';
import useCreatePost from './hooks/useCreatePost';
import useCreatePostStore from './store';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import useLinkPreviewStore from '~/store/linkPreview';

export interface CreatePostProps {
  route?: {
    params?: ICreatePostParams;
  };
}

const CreatePost: FC<CreatePostProps> = ({ route }: CreatePostProps) => {
  const toolbarRef = useRef<any>();
  const screenParams = route?.params || {};

  const commentInputStoreActions = useCommentInputStore(
    (state: ICommentInputState) => state.actions,
  );

  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { showAlert } = useModalStore((state) => state.actions);

  const [postId, setPostId] = useState(
    screenParams?.postId || screenParams?.draftPostId,
  );

  const useCreatePostData = useCreatePost({
    screenParams: {
      ...screenParams,
      postId,
    },
  });
  const createPostStoreActions = useCreatePostStore((state) => state.actions);
  const loading = useCreatePostStore((state) => state.loading);

  const resetCreatePostStore = useCreatePostStore((state) => state.reset);
  const resetMentionInputStore = useMentionInputStore((state) => state.reset);
  const resetLinkPreviewStore = useLinkPreviewStore((state) => state.reset);

  const {
    createPostData,
    isEditPost,
    isEditDraftPost,
    disableButtonPost,
    isEditPostHasChange,
    savePost,
    publishPost,
    disableButtonsCreatePostFooter,
    audienceListWithNoPermission,
  } = useCreatePostData;

  const {
    chosenAudiences, id, important, count,
  } = createPostData;

  const {
    imageDisabled, videoDisabled, fileDisabled, settingDisabled,
  }
    = disableButtonsCreatePostFooter;

  const isCreatingNewPost = !screenParams?.postId || screenParams?.draftPostId;

  const buttonPostProps = {
    loading,
    disabled: disableButtonPost,
    useI18n: true,
    style: { borderWidth: 0 },
    testID: 'create_post.btn_post',
  };

  const userIds: string[] = [];
  const groupIds: string[] = [];
  chosenAudiences.forEach((selected: IAudience) => {
    if (selected.type === 'user') {
      userIds.push(selected.id);
    } else {
      groupIds.push(selected.id);
    }
  });

  useEffect(() => {
    if (!postId) {
      const audience = { groupIds, userIds };

      const newPost: IPostCreatePost = {
        audience,
        content: '',
      };
      createPostStoreActions.createNewPost(newPost);
    }
  }, []);

  // After createNewPost, we have post id, then update post id state
  useEffect(() => {
    if (id) {
      setPostId(id);
    }
  }, [id]);

  const { actions: draftPostActions } = useDraftPostStore();

  const handleBackPress = () => {
    toolbarRef?.current?.goBack?.();
  };

  useBackPressListener(handleBackPress);

  useEffect(
    () => () => {
      resetCreatePostStore();
      resetMentionInputStore();
      resetLinkPreviewStore();
      // clear comment because of comment input view listen emit event change text
      commentInputStoreActions.setCreateComment({ content: '', loading: false });
    },
    [],
  );

  const onPressBack = () => {
    handleBack({
      isEditPost,
      isEditPostHasChange,
      hasPostId: !!postId,
      rootNavigation,
      isEditDraftPost,
      onPressDraftPost,
    });
  };

  const onPressDraftPost = () => {
    if (isEditDraftPost) {
      draftPostActions.getDraftPosts({ isRefresh: true });
      rootNavigation.navigate(menuStack.yourContent, { initTab: 0 });
    }
  };

  const onSavePost = () => {
    Keyboard.dismiss();
    savePost({
      disableNavigate: false,
      replaceWithDetail: screenParams.replaceWithDetail,
    });
  };

  const onPublishPost = () => {
    Keyboard.dismiss();
    publishPost();
  };

  const onPressSettings = () => {
    if (audienceListWithNoPermission.length > 0) {
      const audienceListNames = audienceListWithNoPermission
        .map((audience) => audience.name)
        .join(', ');
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
      showAlert(alertPayload);
      return;
    }

    rootNavigation.navigate(homeStack.postSettings);
  };

  const onPressTags = () => {
    rootNavigation.navigate(homeStack.createPostTags);
  };

  const onPressSeries = () => {
    rootNavigation.navigate(homeStack.createPostSeries);
  };

  return (
    <ScreenWrapper isFullView testID="CreatePostScreen">
      <Header
        titleTextProps={{ useI18n: true }}
        title={
          isCreatingNewPost ? 'post:title_create_post' : 'post:title_edit_post'
        }
        buttonText={isCreatingNewPost ? 'common:btn_publish' : 'post:save'}
        buttonProps={buttonPostProps}
        onPressBack={onPressBack}
        onPressButton={isCreatingNewPost ? onPublishPost : onSavePost}
        style={styles.headerStyle}
      />
      <View style={styles.flex1}>
        <View>
          {!!important?.active && (
            <CreateBannerImportant type="post" expiresTime={important.expiresTime} />
          )}
          <CreatePostChosenAudiences disabled={loading} />
          <Divider color={theme.colors.neutral5} />
        </View>
        <CreatePostContent
          groupIds={groupIds}
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
          settingDisabled={settingDisabled}
          onPressTags={onPressTags}
          onPressSeries={onPressSeries}
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
