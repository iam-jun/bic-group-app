import {all} from 'redux-saga/effects';
import appSaga from './app/saga';
import modalSaga from './modal/saga';
import authSaga from '../screens/Auth/redux/saga';
import chatSaga from '../screens/Chat/redux/saga';
import commentSaga from '../screens/Home/Comment/redux/saga';
import postSaga from '../screens/CreatePost/redux/saga';
import groupsSaga from '~/screens/Groups/redux/saga';

export default function* rootSagas() {
  yield all([
    appSaga(),
    modalSaga(),
    authSaga(),
    chatSaga(),
    commentSaga(),
    postSaga(),
    groupsSaga(),
  ]);
}
