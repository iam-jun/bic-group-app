import { IPayloadAddToAllPost } from '~/interfaces/IPost';
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
    const postId = payload?.activities?.[0]?.id || '';
    if (!!postId) {
      const data:IPostsInProgressState = get();
      const { total = 0, data: posts = [] } = data;

      const newPosts = posts.filter?.((p: any) => p?.id !== postId);
      if (newPosts.length !== posts.length) {
        set((state: IPostsInProgressState) => {
          state.total = Math.max(total - 1, 0);
          state.data = newPosts;
        }, 'updatePostContainingVideoInProgressByNoti');
        if (
          payload?.extra?.type
          === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL
        ) {
          const feed
            = useHomeStore.getState().feed[ContentFeed.ALL][AttributeFeed.ALL];
          const homePosts = feed.data || [];
          const filterPosts = homePosts.filter((item) => item === postId);
          const isExisted = filterPosts.length > 0;
          if (!isExisted) {
            const newHomePosts = [
              payload.activities[0].id,
              ...homePosts,
            ] as any;
            usePostsStore.getState().actions.addToPosts({
              data: { ...payload.activities[0] },
            } as IPayloadAddToAllPost);
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
    }
  } catch (e: any) {
    console.error(
      '\x1b[31m🐣️ updatePostsInProgress error: ',
      e,
      '\x1b[0m',
    );
  }
};

export default updatePostsInProgress;
