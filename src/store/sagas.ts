import {all} from 'redux-saga/effects';
import appSaga from './app/saga';
import modalSaga from './modal/saga';
import authSaga from '../screens/Auth/redux/saga';
import chatSaga from '../screens/Chat/chat/saga';
import commentSaga from '../screens/Comment/redux/saga';

export default function* rootSagas() {
  yield all([
    appSaga(),
    modalSaga(),
    authSaga(),
    chatSaga(),
    commentSaga(),
  ]);
}
