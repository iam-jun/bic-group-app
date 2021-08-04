import {put, takeLatest} from 'redux-saga/effects';
import notificationsDataHelper from '~/screens/Notification/helper/NotificationDataHelper';
import notificationsActions from '~/screens/Notification/redux/actions';
import notificationsTypes from '~/screens/Notification/redux/types';
import {IGetStreamDispatch} from '~/interfaces/common';

export default function* notificationsSaga() {
  yield takeLatest(notificationsTypes.GET_NOTIFICATIONS, getNotifications);
}

function* getNotifications({payload}: {payload: IGetStreamDispatch}) {
  try {
    const {userId, streamClient} = payload;
    yield put(notificationsActions.setLoadingNotifications(true));

    const result = yield notificationsDataHelper.getNotificationList(
      userId,
      streamClient,
    );
    yield put(notificationsActions.setNotifications(result));

    yield put(notificationsActions.setLoadingNotifications(false));
  } catch (err) {
    yield put(notificationsActions.setLoadingNotifications(false));
    console.log(
      '\x1b[33m',
      'khanh --- getNotifications | getNotifications : error',
      err,
      '\x1b[0m',
    );
  }
}
