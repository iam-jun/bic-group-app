import { put, select } from 'redux-saga/effects';
import { get, isEmpty } from 'lodash';

import postActions from '~/storeRedux/post/actions';
import homeKeySelector from '~/storeRedux/home/keySelector';
import homeActions from '~/storeRedux/home/actions';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';

function* updatePostsContainingVideoInProgress({
  payload,
}: {
  type: string;
  payload: any;
}): any {
  try {
    const allPostContainingVideoInProgress = (yield select((state) => get(
      state, 'post.allPostContainingVideoInProgress',
    ))) || {};

    const postId = payload?.activities?.[0]?.id || '';
    if (!isEmpty(allPostContainingVideoInProgress) && postId) {
      const { total = 0, data = [] } = allPostContainingVideoInProgress;
      const newList = data.filter?.((p: any) => p?.id !== postId);
      if (newList.length !== data.length) {
        yield put(postActions.setAllPostContainingVideoInProgress({
          total: Math.max(
            total - 1, 0,
          ),
          data: newList,
        }));
        if (
          payload?.extra?.type
          === NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL
        ) {
          const homePosts = yield select((state) => get(
            state, homeKeySelector.homePosts,
          )) || [];
          const newHomePosts = [
            { ...payload.activities[0] },
            ...homePosts,
          ] as any;

          yield put(homeActions.setHomePosts(newHomePosts));
          yield put(postActions.addToAllPosts({ data: { ...payload.activities[0] } }));
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
