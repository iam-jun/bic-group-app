import { all } from 'redux-saga/effects';
import appSaga from './app/saga';
import modalSaga from './modal/saga';
import authSaga from './auth/saga';
import groupsSaga from '~/storeRedux/groups/saga';
import postSaga from '~/storeRedux/post/saga';
import homeSaga from '~/storeRedux/home/saga';
import notifications from '~/storeRedux/notification/saga';
import menuSaga from '~/storeRedux/menu/saga';
import noInternetSaga from '~/storeRedux/network/saga';
import mentionInputSaga from '~/beinComponents/inputs/MentionInput/redux/saga';
import giphySaga from './giphy/saga';

export default function* rootSagas() {
  yield all([
    appSaga(),
    modalSaga(),
    authSaga(),
    groupsSaga(),
    postSaga(),
    homeSaga(),
    notifications(),
    menuSaga(),
    noInternetSaga(),
    mentionInputSaga(),
    giphySaga(),
  ]);
}
