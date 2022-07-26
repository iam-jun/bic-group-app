import { get } from 'lodash';
import { call, put, select } from 'redux-saga/effects';

import postKeySelector from '../keySelector';
import postActions from '../actions';
import postDataHelper from '../../helper/PostDataHelper';
import { IPayloadGetDraftPosts } from '~/interfaces/IPost';

export default function* getDraftPosts({
  payload,
}: {
  type: string;
  payload: IPayloadGetDraftPosts;
}): any {
  const { isRefresh = true } = payload;
  const draftPostsData = yield select((s) => get(s, postKeySelector.draftPostsData));
  const {
    posts: draftPosts,
    canLoadMore,
    refreshing,
    loading,
  } = draftPostsData || {};

  try {
    if (!refreshing && !loading && (isRefresh || canLoadMore)) {
      if (isRefresh) {
        const newData = { ...draftPostsData, refreshing: true };
        yield put(postActions.setDraftPosts(newData));
      } else {
        const newData = { ...draftPostsData, loading: true };
        yield put(postActions.setDraftPosts(newData));
      }

      const offset = isRefresh ? 0 : draftPosts?.length || 0;
      const response = yield call(postDataHelper.getDraftPosts, {
        offset,
      });

      const newPosts = isRefresh
        ? response?.data || []
        : draftPosts.concat(response?.data || []);

      yield put(
        postActions.setDraftPosts({
          posts: newPosts,
          canLoadMore: response?.canLoadMore,
          loading: false,
          refreshing: false,
        }),
      );
    } else {
      console.error('\x1b[31m🐣️ saga getDraftPosts cant load more\x1b[0m');
    }
  } catch (e) {
    const newData = { ...draftPostsData, loading: false, refreshing: false };
    yield put(postActions.setDraftPosts(newData));
    console.error('\x1b[31m🐣️ saga getDraftPosts error: ', e, '\x1b[0m');
  }
}
