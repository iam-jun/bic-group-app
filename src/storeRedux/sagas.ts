import { all } from 'redux-saga/effects';
import groupsSaga from '~/storeRedux/groups/saga';

export default function* rootSagas() {
  yield all([
    groupsSaga(),
  ]);
}
