import {cloneDeep, get} from 'lodash';
import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import errorCode from '~/constants/errorCode';
import {IGetStreamDispatch, IToastMessage} from '~/interfaces/common';
import {
  ILoadNewNotifications,
  IMarkAsReadAnActivity,
} from '~/interfaces/INotification';
import notificationsDataHelper from '~/screens/Notification/helper/NotificationDataHelper';
import notificationsActions from '~/screens/Notification/redux/actions';
import notificationsTypes from '~/screens/Notification/redux/types';
import {initPushTokenMessage} from '~/services/helper';
import {makePushTokenRequest} from '~/services/httpApiRequest';
import * as modalActions from '~/store/modal/actions';
import notificationSelector from './selector';

export default function* notificationsSaga() {
  yield takeLatest(notificationsTypes.GET_NOTIFICATIONS, getNotifications);
  yield takeLatest(notificationsTypes.MARK_AS_READ_ALL, markAsReadAll);
  yield takeLatest(notificationsTypes.MARK_AS_SEEN_ALL, markAsSeenAll);
  yield takeLatest(notificationsTypes.MARK_AS_READ, markAsRead);
  yield takeLatest(notificationsTypes.LOADMORE, loadmore);
  yield takeEvery(
    notificationsTypes.LOAD_NEW_NOTIFICATIONS,
    loadNewNotifications,
  );
  yield takeLatest(notificationsTypes.REGISTER_PUSH_TOKEN, registerPushToken);
}

function* getNotifications({
  payload,
}: {
  payload: IGetStreamDispatch;
  type: string;
}) {
  try {
    const {userId, streamClient} = payload;
    yield put(notificationsActions.setLoadingNotifications(true));
    const response = yield notificationsDataHelper.getNotificationList(
      userId,
      streamClient,
    );

    yield put(notificationsActions.setLoadingNotifications(false));
    yield put(
      notificationsActions.setNotifications({
        notifications: response.results,
        unseen: response.unseen,
      }),
    );
  } catch (err) {
    yield put(notificationsActions.setLoadingNotifications(true));
    console.log(
      '\x1b[33m',
      'khanh --- getNotifications | getNotifications : error',
      err,
      '\x1b[0m',
    );
  }
}

// load new notifications when have realtime event
function* loadNewNotifications({
  payload,
}: {
  payload: ILoadNewNotifications;
  type: string;
}) {
  try {
    const {userId, notiGroupId, streamClient, limit} = payload;
    const response = yield notificationsDataHelper.loadNewNotification(
      userId,
      notiGroupId,
      limit, // only load a number of notifiations equal number of new notifications
      streamClient,
    );

    yield put(
      notificationsActions.addNewNotifications({
        notifications: response.results,
        unseen: response.unseen,
      }),
    );
  } catch (err) {
    console.log('\x1b[33m', 'loadNewNotifications error:', err, '\x1b[0m');
  }
}

function* markAsReadAll({
  payload,
}: {
  payload: IGetStreamDispatch;
  type: string;
}) {
  try {
    // send request to Getstream to mark notification as read without waiting response
    const {userId, streamClient} = payload;
    notificationsDataHelper.markAsReadAll(userId, streamClient);

    // get all notifications from store
    const notifications =
      cloneDeep(
        yield select(state => get(state, notificationSelector.notifications)),
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

    yield put(
      modalActions.showHideToastMessage({
        content: 'notification:mark_all_as_read_success',
        props: {
          textProps: {useI18n: true},
          type: 'success',
        },
      }),
    );
  } catch (err) {
    console.log('\x1b[33m', 'notification markAsReadAll error', err, '\x1b[0m');
    yield showError(err);
  }
}

function* markAsSeenAll({
  payload,
}: {
  payload: IGetStreamDispatch;
  type: string;
}) {
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
    yield showError(err);
  }
}

function* markAsRead({
  payload,
}: {
  payload: IMarkAsReadAnActivity;
  type: string;
}) {
  try {
    // send request to Getstream to mark notification as read without waiting response
    const {userId, streamClient, activityId} = payload;
    notificationsDataHelper.markAsRead(userId, activityId, streamClient);

    // get all notifications from store
    const notifications =
      cloneDeep(
        yield select(state => get(state, notificationSelector.notifications)),
      ) || [];

    // then set mapped notificaton's is_read field by true to un-highlight it directly on device store
    notifications.forEach(notificationGroup => {
      if (notificationGroup.id === activityId) {
        notificationGroup.is_read = true;
      }
    });

    // finally, set notification back to store,
    yield put(
      notificationsActions.setNotifications({
        notifications: notifications,
        unseen: 0, // hardcode because we re-use setNotifications function
      }),
    );
  } catch (err) {
    console.log('\x1b[33m', 'notification markAsRead error', err, '\x1b[0m');
  }
}

// load more old notifications
function* loadmore({payload}: {payload: IGetStreamDispatch; type: string}) {
  try {
    // show loading more spinner, set isLoadingMore = true
    yield put(notificationsActions.setIsLoadingMore(true));

    const {userId, streamClient} = payload;

    // get all notifications from store
    const notifications = yield select(state =>
      get(state, notificationSelector.notifications),
    ) || [];

    // load more from the last notification
    const bottomNoti = notifications[notifications.length - 1];
    const response = yield notificationsDataHelper.getNotificationList(
      userId,
      streamClient,
      bottomNoti.id,
    );

    // hide loading more spinner, set isLoadingMore = false
    yield put(notificationsActions.setIsLoadingMore(false));

    // add loaded notification to bottom of current notification list
    // set noMoreNotification = true if loaded notification is empty
    if (response.results.length > 0) {
      yield put(
        notificationsActions.concatNotifications({
          notifications: response.results,
          unseen: response.unseen,
        }),
      );
    } else {
      yield put(notificationsActions.setNoMoreNoti(true));
    }
  } catch (err) {
    console.log('\x1b[33m', '--- load more : error', err, '\x1b[0m');
  }
}

// register push token
function* registerPushToken({payload}: any) {
  try {
    const {auth, notifications} = yield select();
    const requestToken = payload?.token || notifications?.pushToken;
    const messaging = yield initPushTokenMessage();
    const newToken = yield messaging().getToken();
    if (requestToken === newToken) {
      return;
    }
    yield makePushTokenRequest(
      newToken,
      auth.chat?.accessToken,
      auth.chat?.userId,
    );
    yield put(notificationsActions.savePushToken(newToken));
  } catch (e) {
    console.log('register push token failed', e);
  }
}

function* showError(err: any) {
  if (err.code === errorCode.systemIssue) return;

  const toastMessage: IToastMessage = {
    content:
      err?.meta?.message ||
      err?.meta?.errors?.[0]?.message ||
      'common:text_error_message',
    props: {
      textProps: {useI18n: true},
      type: 'error',
    },
  };
  yield put(modalActions.showHideToastMessage(toastMessage));
}
