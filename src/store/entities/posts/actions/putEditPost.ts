import i18n from 'i18next';
import {
  IParamUpdatePost, IPayloadAddToAllPost, IPayloadGetDraftContents, IPayloadPutEditPost, PostStatus, PostType,
} from '~/interfaces/IPost';
import { IPostsState } from '../index';
import streamApi from '~/api/StreamApi';
import useCreatePostStore from '~/screens/post/CreatePost/store';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { IToastMessage } from '~/interfaces/common';
import { ToastType } from '~/baseComponents/Toast/BaseToast';
import showToast from '~/store/helper/showToast';
import useValidateSeriesTags from '~/components/ValidateSeriesTags/store';
import ApiErrorCode from '~/constants/apiErrorCode';
import usePostsInProgressStore from '~/screens/Home/components/VideoProcessingNotice/store';
import useTimelineStore from '~/store/timeline';
import useDraftPostStore from '~/screens/YourContent/components/Draft/DraftPost/store';
import useDraftContentsStore from '~/screens/YourContent/components/Draft/DraftContents/store';
import useHomeStore from '~/screens/Home/store';

const navigation = withNavigation(rootNavigationRef);

const putEditPost = (_set, get) => async (payload: IPayloadPutEditPost) => {
  const {
    id, data, replaceWithDetail = true, onRetry, msgSuccess, msgError, disableNavigate,
    onError, isPublish = true, createFromGroupId, isHandleSeriesTagsError = true, isRefresh = true,
  } = payload || {};

  if (!id) {
    console.error('\x1b[31m🐣️ putEditPost: Id not found\x1b[0m');
    return;
  }

  try {
    const { actions }: IPostsState = get() || {};
    const params: IParamUpdatePost = {
      postId: id,
      data,
    };

    // isPublish: editing published post or publish a draft post
    // if auto save a draft post, then no need to do anything more
    if (!isPublish) {
      await streamApi.putAutoSavePost(params);
      return;
    }

    useCreatePostStore.getState().actions.setLoadingCreatePost(true);

    const response = await streamApi.putPublishPost(params);

    useCreatePostStore.getState().actions.setLoadingCreatePost(false);

    if (!response || !response.data) {
      onError?.();
      return;
    }

    const post = response.data;
    actions.addToPosts({ data: post } as IPayloadAddToAllPost);

    if (msgSuccess) {
      showToast({
        content: msgSuccess,
      });
    }

    if (post.status === PostStatus.PROCESSING) {
      showToast({
        content: 'post:draft:text_processing_publish',
      });
      usePostsInProgressStore.getState().actions.getPosts();
      if (!disableNavigate) { navigation.goBack(); }
    } else if (!disableNavigate) {
      navigate(replaceWithDetail, post.id);
    }

    if (createFromGroupId) {
      useTimelineStore.getState().actions.getPosts(createFromGroupId);
    }

    if (isRefresh) {
      const payloadGetDraftContents: IPayloadGetDraftContents = {
        isRefresh: true,
      };
      useDraftPostStore.getState().actions.getDraftPosts(payloadGetDraftContents);
      useDraftContentsStore.getState().actions.getDraftContents(payloadGetDraftContents);
      useHomeStore.getState().actions.refreshHome();
    }
  } catch (error) {
    onError?.();
    useCreatePostStore.getState().actions.setLoadingCreatePost(false);

    const errorCode = error?.code;
    if (errorCode === ApiErrorCode.Post.POST_INVALID_PARAM && isHandleSeriesTagsError) {
      useValidateSeriesTags.getState().actions.handleSeriesTagsError({ error, postType: PostType.POST });
    } else {
      const btnRetry = onRetry && {
        buttonText: i18n.t('common:text_retry'),
        onButtonPress: onRetry,
      };
      const toast: IToastMessage = {
        content: error?.meta?.message || msgError || 'post:text_edit_post_failed',
        type: ToastType.ERROR,
        ...btnRetry,
      };
      showToast(toast);
    }
  }
};

export function navigate(replaceWithDetail: boolean, postId?: string) {
  if (replaceWithDetail) {
    navigation.replace(homeStack.postDetail, { post_id: postId });
  } else {
    navigation.goBack();
  }
}

export default putEditPost;
