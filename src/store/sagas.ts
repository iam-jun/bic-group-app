import {all} from 'redux-saga/effects';
import appSaga from './app/saga';
import modalSaga from './modal/saga';
import authSaga from '../screens/Auth/redux/saga';
import chatSaga from '../screens/Chat/redux/saga';
import groupsSaga from '~/screens/Groups/redux/saga';
import postSaga from '~/screens/Post/redux/saga';
import homeSaga from '~/screens/Home/redux/saga';

export default function* rootSagas() {
  yield all([
    appSaga(),
    modalSaga(),
    authSaga(),
    chatSaga(),
    groupsSaga(),
    postSaga(),
    homeSaga(),
  ]);
}
