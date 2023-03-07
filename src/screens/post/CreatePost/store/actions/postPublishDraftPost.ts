import streamApi from '~/api/StreamApi';
import {
  IPayloadGetDraftPosts, IPayloadPublishDraftPost, IPost, PostStatus,
} from '~/interfaces/IPost';
import { withNavigation } from '~/router/helper';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { rootNavigationRef } from '~/router/refs';
import useDraftPostStore from '~/screens/Draft/DraftPost/store';
import usePostsInProgressStore from '~/screens/Home/components/VideoProcessingNotice/store';
import useHomeStore from '~/screens/Home/store';
import usePostsStore from '~/store/entities/posts';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';
import useTimelineStore from '~/store/timeline';
import { ICreatePostState } from '..';

const navigation = withNavigation(rootNavigationRef);

export const postPublishDraftPost = (set, get) => async (payload: IPayloadPublishDraftPost) => {
  const { actions }: ICreatePostState = get();
  const {
    draftPostId,
    onSuccess,
    onError,
    replaceWithDetail,
    createFromGroupId,
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
    const payloadGetDraftPosts: IPayloadGetDraftPosts = {
      isRefresh: true,
    };
    useDraftPostStore.getState().actions.getDraftPosts(payloadGetDraftPosts);
    useHomeStore.getState().actions.refreshHome();
  } catch (e) {
    actions.setLoadingCreatePost(false);
    onError?.();
    showToastError(e);
  }
};

export default postPublishDraftPost;
