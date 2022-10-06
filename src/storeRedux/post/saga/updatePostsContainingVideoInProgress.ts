import { cloneDeep, get, isEmpty } from 'lodash';
import { put, select } from 'redux-saga/effects';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';

import postActions from '~/storeRedux/post/actions';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import useHomeStore from '~/screens/Home/store';

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
          const homePosts = useHomeStore.getState().tabNewsfeed.data || [];
          const filterPosts = homePosts.filter((item) => item.id === postId);
          const isExisted = filterPosts.length > 0;
          if (!isExisted) {
            const newHomePosts = [
              { ...payload.activities[0] },
              ...homePosts,
            ] as any;

            const data = cloneDeep(newHomePosts);
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            yield call(useHomeStore.getState().actions.setTabNewsfeed, { data });
            usePostsStore.getState().actions.addToPosts({ data: { ...payload.activities[0] } } as IPayloadAddToAllPost);
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
