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

    const response = yield notificationsDataHelper.getNotificationList(
      userId,
      streamClient,
    );

    yield put(
      notificationsActions.setNotifications({
        notifications: response.results,
        unseen: response.unseen,
      }),
    );
  } catch (err) {
    console.log(
      '\x1b[33m',
      'khanh --- getNotifications | getNotifications : error',
      err,
      '\x1b[0m',
    );
  }
}
