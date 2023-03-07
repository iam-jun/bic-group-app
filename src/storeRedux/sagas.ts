import { all } from 'redux-saga/effects';
import modalSaga from './modal/saga';
import groupsSaga from '~/storeRedux/groups/saga';
import postSaga from '~/storeRedux/post/saga';

export default function* rootSagas() {
  yield all([
    modalSaga(),
    groupsSaga(),
    postSaga(),
  ]);
}
