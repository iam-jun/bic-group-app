import { all } from 'redux-saga/effects';
import appSaga from './app/saga';
import modalSaga from './modal/saga';
import groupsSaga from '~/storeRedux/groups/saga';
import postSaga from '~/storeRedux/post/saga';
import menuSaga from '~/storeRedux/menu/saga';
import noInternetSaga from '~/storeRedux/network/saga';

export default function* rootSagas() {
  yield all([
    appSaga(),
    modalSaga(),
    groupsSaga(),
    postSaga(),
    menuSaga(),
    noInternetSaga(),
  ]);
}
