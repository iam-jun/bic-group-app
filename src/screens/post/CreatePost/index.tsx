import React, {
  FC, useEffect, useRef, useState,
} from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Divider from '~/beinComponents/Divider';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';

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
import CreateBannerImportant from '~/components/ContentSettings/CreateBannerImportant';
import { handleBack } from './handler';
import useDraftPostStore from '../../YourContent/components/Draft/DraftPost/store';
import useCommentInputStore from '../../comments/components/CommentInputView/store';
import ICommentInputState from '../../comments/components/CommentInputView/store/Interface';
import menuStack from '~/router/navigator/MainStack/stacks/menuStack/stack';
import useCreatePost from './hooks/useCreatePost';
import useCreatePostStore from './store';
import useMentionInputStore from '~/beinComponents/inputs/MentionInput/store';
import useLinkPreviewStore from '~/store/linkPreview';
import { Schedule } from '~/components/ScheduleContent';
import useSchedulePost from './hooks/useSchedulePost';

export interface CreatePostProps {
  route?: {
    params?: ICreatePostParams;
  };
}

const CreatePost: FC<CreatePostProps> = ({ route }: CreatePostProps) => {
  const toolbarRef = useRef<any>();
  const screenParams = route?.params || {};
  const {
    postId: screenParamsPostId,
    draftPostId: screenParamsDraftPostId,
    replaceWithDetail,
  } = screenParams;

  const commentInputStoreActions = useCommentInputStore(
    (state: ICommentInputState) => state.actions,
  );

  const { rootNavigation } = useRootNavigation();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const [postId, setPostId] = useState(
    screenParamsPostId || screenParamsDraftPostId,
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
    isSchedule,
    isValidating,
    disableButtonPost,
    disableButtonScheduledPost,
    isEditPostHasChange,
    prepareData,
    savePost,
    validateSeriesTags,
    handleSeriesTagsError,
    disableButtonsCreatePostFooter,
  } = useCreatePostData;

  const { handleOpenPopupSchedule, doAfterScheduleSuccess } = useSchedulePost({
    postId,
    validButtonPublish: !disableButtonPost,
    replaceWithDetail,
    validateSeriesTags,
    handleSeriesTagsError,
    handleSave: savePost,
    prepareData,
  });

  const {
    chosenAudiences, id, important, count,
  } = createPostData;

  const {
    imageDisabled, videoDisabled, fileDisabled, settingDisabled,
  }
    = disableButtonsCreatePostFooter;

  const isCreatingNewPost = checkIsCreatingNewPost(screenParams);

  const buttonPostProps = {
    loading,
    disabled: isSchedule ? disableButtonScheduledPost : disableButtonPost,
    useI18n: true,
    style: { borderWidth: 0 },
    testID: 'create_post.btn_post',
  };

  const renderBtnSchedule = () => {
    if (isEditDraftPost || isSchedule) {
      return (
        <Schedule
          isValidating={isValidating}
          validButton={!disableButtonPost}
          handleOpenPopupSchedule={handleOpenPopupSchedule}
        />
      );
    }
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
      commentInputStoreActions.setCreateComment({
        content: '',
        loading: false,
      });
    },
    [],
  );

  const onPressBack = () => {
    handleBack({
      isEditPost,
      isEditPostHasChange,
      isSchedule,
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
    if (isSchedule) {
      savePost({
        disableNavigate: true,
        replaceWithDetail: false,
        isPublish: true,
        isCreatingNewPost: false,
        onSuccessPutEdit: () => doAfterScheduleSuccess(false),
      });
    } else {
      savePost({
        disableNavigate: false,
        replaceWithDetail,
        isPublish: true,
        isCreatingNewPost,
      });
    }
  };

  const onPressSettings = () => {
    rootNavigation.navigate(homeStack.postSettings, { postId });
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
        onPressButton={onSavePost}
        renderCustomComponent={renderBtnSchedule}
        style={styles.headerStyle}
      />
      <View style={styles.flex1}>
        <View>
          {!!important?.active && (
            <CreateBannerImportant
              type="post"
              expiresTime={important.expiresTime}
            />
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

const checkIsCreatingNewPost = (screenParams: ICreatePostParams) => {
  if (!screenParams?.postId || screenParams?.draftPostId) {
    return true;
  }
  return false;
};
