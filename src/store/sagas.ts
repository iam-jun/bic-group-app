import {all} from 'redux-saga/effects';
import homeSaga from '~/screens/Home/redux/saga';
import appSaga from './app/saga';
import modalSaga from './modal/saga';
import authSaga from '../screens/Auth/redux/saga';
import chatSaga from '../screens/Chat/redux/saga';
import commentSaga from '../screens/Home/Comment/redux/saga';
import postSaga from '../screens/Post/redux/saga';
import groupsSaga from '~/screens/Groups/redux/saga';

export default function* rootSagas() {
  yield all([
    appSaga(),
    modalSaga(),
    authSaga(),
    chatSaga(),
    commentSaga(),
    groupsSaga(),
    homeSaga(),
    postSaga(),
  ]);
}
