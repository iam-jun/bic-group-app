import streamApi from '~/api/StreamApi';
import {
  IPayloadGetDraftContents, IPayloadPublishDraftPost, IPost, PostStatus, PostType,
} from '~/interfaces/IPost';
import { withNavigation } from '~/router/helper';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { rootNavigationRef } from '~/router/refs';
import useDraftPostStore from '~/screens/YourContent/components/Draft/DraftPost/store';
import usePostsInProgressStore from '~/screens/Home/components/VideoProcessingNotice/store';
import useHomeStore from '~/screens/Home/store';
import usePostsStore from '~/store/entities/posts';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';
import useTimelineStore from '~/store/timeline';
import { ICreatePostState } from '..';
import ApiErrorCode from '~/constants/apiErrorCode';
import useValidateSeriesTags from '~/components/ValidateSeriesTags/store';
import useDraftContentsStore from '~/screens/YourContent/components/Draft/DraftContents/store';

const navigation = withNavigation(rootNavigationRef);

export const postPublishDraftPost = (set, get) => async (payload: IPayloadPublishDraftPost) => {
  const { actions }: ICreatePostState = get();
  const {
    draftPostId,
    onSuccess,
    onError,
    replaceWithDetail,
    createFromGroupId,
    isHandleSeriesTagsError = false,
  } = payload || {};
  try {
    actions.setLoadingCreatePost(true);
    const res = await streamApi.postPublishDraftPost(draftPostId);
    actions.setLoadingCreatePost(false);

    if (!res.data) {
      onError?.();
      showToastError(res);
      return;
    }

    onSuccess?.();
    const postData: IPost = res.data;
    usePostsStore.getState().actions.addToPosts({ data: postData });

    if (res.data?.status === PostStatus.PROCESSING) {
      showToast({
        content: 'post:draft:text_processing_publish',
      });
      navigation.goBack();
      usePostsInProgressStore.getState().actions.getPosts();
    } else if (replaceWithDetail) {
      navigation.replace(
        homeStack.postDetail, { post_id: postData?.id },
      );
    }

    if (createFromGroupId) {
      useTimelineStore.getState().actions.getPosts(createFromGroupId);
    }
    const payloadGetDraftPosts: IPayloadGetDraftContents = {
      isRefresh: true,
    };
    useDraftPostStore.getState().actions.getDraftPosts(payloadGetDraftPosts);
    useDraftContentsStore.getState().actions.getDraftContents({ isRefresh: true });
    useHomeStore.getState().actions.refreshHome();
  } catch (error) {
    actions.setLoadingCreatePost(false);

    const errorCode = error?.code;
    if (errorCode === ApiErrorCode.Post.POST_INVALID_PARAM && isHandleSeriesTagsError) {
      useValidateSeriesTags.getState().actions.handleSeriesTagsError({ error, postType: PostType.POST });
    } else {
      onError?.();
      showToastError(error);
    }
  }
};

export default postPublishDraftPost;
