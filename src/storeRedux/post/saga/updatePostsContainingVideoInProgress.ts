import { get, isEmpty } from 'lodash';
import { put, select } from 'redux-saga/effects';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';

import postActions from '~/storeRedux/post/actions';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import useHomeStore from '~/screens/Home/store';
import { AttributeFeed, ContentFeed } from '~/screens/Home/store/Interface';

function* updatePostsContainingVideoInProgress({
  payload,
}: {
  type: string;
  payload: any;
}): any {
  try {
    const allPostContainingVideoInProgress
      = (yield select((state) => get(state, 'post.allPostContainingVideoInProgress'))) || {};

    const postId = payload?.activities?.[0]?.id || '';
    if (!isEmpty(allPostContainingVideoInProgress) && postId) {
      const { total = 0, data = [] } = allPostContainingVideoInProgress;
      const newList = data.filter?.((p: any) => p?.id !== postId);
      if (newList.length !== data.length) {
        yield put(
          postActions.setAllPostContainingVideoInProgress({
            total: Math.max(total - 1, 0),
            data: newList,
          }),
        );
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
      '\x1b[31m🐣️ saga updatePostsContainingVideoInProgress error: ',
      e,
      '\x1b[0m',
    );
  }
}

export default updatePostsContainingVideoInProgress;
