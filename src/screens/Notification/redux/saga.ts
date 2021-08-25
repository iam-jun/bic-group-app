import {put, takeLatest, select} from 'redux-saga/effects';
import notificationsDataHelper from '~/screens/Notification/helper/NotificationDataHelper';
import notificationsActions from '~/screens/Notification/redux/actions';
import notificationsTypes from '~/screens/Notification/redux/types';
import {IGetStreamDispatch, IHeaderFlashMessage} from '~/interfaces/common';
import notificationSelector from './selector';
import {get} from 'lodash';
import {showHeaderFlashMessage} from '~/store/app/actions';
import {timeOut} from '~/utils/common';

export default function* notificationsSaga() {
  yield takeLatest(notificationsTypes.GET_NOTIFICATIONS, getNotifications);
  yield takeLatest(notificationsTypes.MARK_AS_READ_ALL, markAsReadAll);
  yield takeLatest(notificationsTypes.MARK_AS_SEEN_ALL, markAsSeenAll);
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

function* markAsReadAll({payload}: {payload: IGetStreamDispatch}) {
  try {
    // send request to Getstream to mark notification as read without waiting response
    const {userId, streamClient} = payload;
    notificationsDataHelper.markAsReadAll(userId, streamClient);

    // get all notifications from store
    const notifications = yield select(state =>
      get(state, notificationSelector.notifications),
    ) || [];

    // then set theirs is_read field by true to un-highlight them directly on device store
    notifications.forEach(notificationGroup => {
      notificationGroup.is_read = true;
    });

    // finally, set notification back to store,
    yield put(
      notificationsActions.setNotifications({
        notifications: notifications,
        unseen: 0, // hardcode because we re-use setNotifications function
      }),
    );

    const flashMessage: IHeaderFlashMessage = {
      content: 'notification:mark_all_as_read_success',
      props: {
        textProps: {variant: 'h6', useI18n: true},
        type: 'success',
      },
    };
    yield timeOut(500);
    yield put(showHeaderFlashMessage(flashMessage));
  } catch (err) {
    console.log('\x1b[33m', 'notification markAsReadAll error', err, '\x1b[0m');
  }
}

function* markAsSeenAll({payload}: {payload: IGetStreamDispatch}) {
  try {
    // send request to Getstream to mark notification as seen without waiting response
    const {userId, streamClient} = payload;
    notificationsDataHelper.markAsSeenAll(userId, streamClient);

    // get all notifications from store
    const notifications = yield select(state =>
      get(state, notificationSelector.notifications),
    ) || [];

    // then set theirs is_seen field by true
    notifications.forEach(notificationGroup => {
      notificationGroup.is_seen = true;
    });

    // finally, set notification back to store, and set unseen number to 0 without using Getstream response
    yield put(
      notificationsActions.setNotifications({
        notifications: notifications,
        unseen: 0,
      }),
    );
  } catch (err) {
    console.log('\x1b[33m', 'notification markAsSeenAll error', err, '\x1b[0m');
  }
}
