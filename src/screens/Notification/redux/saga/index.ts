import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import notificationsActions from '~/screens/Notification/redux/actions';
import notificationsTypes from '~/screens/Notification/redux/types';
import {initPushTokenMessage} from '~/services/helper';
import {makePushTokenRequest} from '~/services/httpApiRequest';
import getNotifications from './getNotifications';
import markAsReadAll from './markAsReadAll';
import markAsSeenAll from './markAsSeenAll';
import markAsRead from './markAsRead';
import loadMore from './loadMore';
import markAsUnRead from './markAsUnRead';

export default function* notificationsSaga() {
  yield takeEvery(notificationsTypes.GET_NOTIFICATIONS, getNotifications);
  yield takeLatest(notificationsTypes.MARK_AS_READ_ALL, markAsReadAll);
  yield takeLatest(notificationsTypes.MARK_AS_SEEN_ALL, markAsSeenAll);
  yield takeLatest(notificationsTypes.MARK_AS_READ, markAsRead);
  yield takeEvery(notificationsTypes.LOAD_MORE, loadMore);
  yield takeEvery(notificationsTypes.REGISTER_PUSH_TOKEN, registerPushToken);
  yield takeEvery(notificationsTypes.MARK_AS_UNREAD, markAsUnRead);
}

// register push token
function* registerPushToken({payload}: any): any {
  try {
    const {notifications} = yield select();
    const savedToken = notifications?.pushToken;

    const messaging: any = yield initPushTokenMessage();
    const newToken: string = payload?.token || (yield messaging().getToken());

    if (!!savedToken && newToken === savedToken) {
      //if current token same as new token, just skip
      return;
    }

    //when initPushTokenMessage, onTokenRefresh will be called
    //save token first to avoid call backend multiple times
    yield put(notificationsActions.savePushToken(newToken));
    yield makePushTokenRequest(newToken);
  } catch (e) {
    yield put(notificationsActions.savePushToken(''));
    console.log('register push token failed', e);
  }
}
