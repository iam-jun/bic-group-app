import { get } from 'lodash';
import { call, put, select } from 'redux-saga/effects';

import streamApi from '~/api/StreamApi';
import postActions from '~/storeRedux/post/actions';

function* getPostsContainingVideoInProgress(): any {
  try {
    const response = yield call(
      streamApi.getDraftPosts, {
        isProcessing: true,
      },
    );
    const allPostContainingVideoInProgress = (yield select((state) => get(
      state, 'post.allPostContainingVideoInProgress',
    ))) || {};

    if (response?.data?.length > 0) {
      if (allPostContainingVideoInProgress?.data?.length > 0) {
        let count = 0;
        allPostContainingVideoInProgress.data.forEach((item1: any) => {
          const index = response.data.findIndex((item2: any) => item2?.id === item1?.id);
          if (index !== -1) count += 1;
        });
        if (
          count === response.data.length
          && allPostContainingVideoInProgress.data.length >= count
        ) {
          if (allPostContainingVideoInProgress.total === 0) {
            yield put(postActions.setAllPostContainingVideoInProgress({
              data: response.data,
              total: 0,
            }));
          } else {
            yield put(postActions.setAllPostContainingVideoInProgress(response));
          }
        } else {
          yield put(postActions.setAllPostContainingVideoInProgress(response));
        }
      } else {
        yield put(postActions.setAllPostContainingVideoInProgress(response));
      }
    } else if (allPostContainingVideoInProgress.data.length > 0) {
      yield put(postActions.setAllPostContainingVideoInProgress({
        total: 0,
        data: [],
      }));
    }
  } catch (e: any) {
    console.error(
      '\x1b[31m🐣️ saga getPostsContainingVideoInProgress error: ',
      e,
      '\x1b[0m',
    );
  }
}

export default getPostsContainingVideoInProgress;
