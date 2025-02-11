import usePostsStore from '~/store/entities/posts';

import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import useHomeStore from '~/screens/Home/store';
import { AttributeFeed, ContentFeed } from '~/interfaces/IFeed';
import { IPostsInProgressState } from '..';
import { ISocketNotification } from '~/interfaces/INotification';

const updatePostsInProgress = (set, get) => async (
  payload: ISocketNotification,
) => {
  try {
    const activities = payload?.activities || [];
    if (activities?.length > 0) {
      const postData = activities[0];
      const postId = postData?.id || '';
      const type = payload?.extra?.type || '';
      updateData(set, get)(type, postId, postData);
    } else {
      const { type, postId } = payload || {};
      if (!!postId) {
        usePostsStore.getState().actions.getPostDetail({ postId });
        updateData(set, get)(type, postId);
      }
    }
  } catch (e: any) {
    console.error(
      '\x1b[31m🐣️ updatePostsContainingVideoInProgress error: ',
      e,
      '\x1b[0m',
    );
  }
};

const updateData = (set, get) => (
  type: string, postId: string, postData?: any,
) => {
  try {
    if (!postId) return;
    const data: IPostsInProgressState = get();
    const { total = 0, data: posts = [] } = data;

    const newPosts = posts.filter?.((p: any) => p?.id !== postId);
    if (newPosts.length !== posts.length) {
      set((state: IPostsInProgressState) => {
        state.total = Math.max(total - 1, 0);
        state.data = newPosts;
      }, 'updatePostContainingVideoInProgressByNoti');
      if (
        type === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL
      ) {
        const feed
            = useHomeStore.getState().feed[ContentFeed.ALL][AttributeFeed.ALL];
        const homePosts = feed.data || [];
        const filterPosts = homePosts.filter((item) => item === postId);
        const isExisted = filterPosts.length > 0;
        if (!isExisted) {
          const newHomePosts = [
            postId,
            ...homePosts,
          ] as any;
          if (postData) {
            // get detail post cause noti socket dont give full data of post
            usePostsStore.getState().actions.getPostDetail({ postId });
          }
          useHomeStore
            .getState()
            .actions.setDataFeed(
              { ...feed, data: newHomePosts },
              ContentFeed.ALL,
              AttributeFeed.ALL,
            );
        }
      }
    }
  } catch (e: any) {
    console.error(
      '\x1b[31m🐣️ update data error: ',
      e,
      '\x1b[0m',
    );
  }
};

export default updatePostsInProgress;
