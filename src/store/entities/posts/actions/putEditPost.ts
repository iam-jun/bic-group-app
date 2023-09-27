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
import showToastSuccess from '~/store/helper/showToastSuccess';
import { trackEvent } from '~/services/tracking';
import { TrackingEventContentPublishedProperties } from '~/services/tracking/Interface';
import { TrackingEvent } from '~/services/tracking/constants';
import useScheduledContentsStore from '~/screens/YourContent/components/Scheduled/store';

const navigation = withNavigation?.(rootNavigationRef);

const putEditPost = (_set, get) => async (payload: IPayloadPutEditPost) => {
  const { important = {} } = useCreatePostStore.getState().createPost;
  const {
    id, data, replaceWithDetail = true, onRetry, disableNavigate, isCreatingNewPost = true,
    onError, onSuccessAutoSave, onSuccessPutEdit, isPublish = true, createFromGroupId,
    isHandleSeriesTagsError = true, isRefresh = true,
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
      onSuccessAutoSave?.();
      return;
    }

    useCreatePostStore.getState().actions.setLoadingCreatePost(true);

    let response = null;
    if (isCreatingNewPost) {
      response = await streamApi.putPublishPost(params);
    } else {
      response = await streamApi.putEditPost(params);
    }

    useCreatePostStore.getState().actions.setLoadingCreatePost(false);

    if (!response || !response.data) {
      onError?.();
      return;
    }

    const post = response.data;
    actions.addToPosts({ data: post } as IPayloadAddToAllPost);

    showToastSuccess(response);
    onSuccessPutEdit?.();

    if (isCreatingNewPost) {
      // tracking event
      const eventContentPublishedProperties: TrackingEventContentPublishedProperties = {
        content_type: PostType.POST,
        important: !!important?.active,
      };
      trackEvent({ event: TrackingEvent.CONTENT_PUBLISHED, properties: eventContentPublishedProperties });
    }

    if (post.status === PostStatus.PROCESSING) {
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
      useScheduledContentsStore.getState().actions.refreshAllFeeds();
      useHomeStore.getState().actions.refreshHome();
    }
  } catch (error) {
    onError?.();
    useCreatePostStore.getState().actions.setLoadingCreatePost(false);

    const errorCode = error?.code;
    if (errorCode === ApiErrorCode.Post.TAG_SERIES_INVALID && isHandleSeriesTagsError) {
      useValidateSeriesTags.getState().actions.handleSeriesTagsError({ error, postType: PostType.POST });
    } else {
      const btnRetry = onRetry && {
        buttonText: i18n.t('common:text_retry'),
        onButtonPress: onRetry,
      };
      const toast: IToastMessage = {
        content: error?.meta?.message,
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
