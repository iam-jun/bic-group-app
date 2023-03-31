/* eslint-disable no-console */
import { takeLatest } from 'redux-saga/effects';

import postTypes from '~/storeRedux/post/types';
import removeAudiencesFromPost from './removeAudiencesFromPost';

export default function* postSaga() {
  yield takeLatest(
    postTypes.REMOVE_POST_AUDIENCES,
    removeAudiencesFromPost,
  );
}
