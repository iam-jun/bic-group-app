import {cloneDeep, get} from 'lodash';
import {put, select, takeEvery, takeLatest} from 'redux-saga/effects';
import {IObject, IToastMessage} from '~/interfaces/common';
import {IParamGetNotifications} from '~/interfaces/INotification';
import notificationsDataHelper from '~/screens/Notification/helper/NotificationDataHelper';
import notificationsActions from '~/screens/Notification/redux/actions';
import notificationsTypes from '~/screens/Notification/redux/types';
import {initPushTokenMessage} from '~/services/helper';
import {makePushTokenRequest} from '~/services/httpApiRequest';
import * as modalActions from '~/store/modal/actions';
import notificationSelector from './selector';
import showError from '~/store/commonSaga/showError';

export default function* notificationsSaga() {
  yield takeLatest(notificationsTypes.GET_NOTIFICATIONS, getNotifications);
  yield takeLatest(notificationsTypes.MARK_AS_READ_ALL, markAsReadAll);
  yield takeLatest(notificationsTypes.MARK_AS_SEEN_ALL, markAsSeenAll);
  yield takeLatest(notificationsTypes.MARK_AS_READ, markAsRead);
  yield takeLatest(notificationsTypes.LOADMORE, loadmore);
  yield takeEvery(notificationsTypes.REGISTER_PUSH_TOKEN, registerPushToken);
}

function* getNotifications({
  payload,
}: {
  payload: IParamGetNotifications;
  type: string;
}) {
  try {
    yield put(notificationsActions.setLoadingNotifications(true));
    yield put(notificationsActions.setNoMoreNoti(false));

    const response: IObject<any> =
      yield notificationsDataHelper.getNotificationList(payload || {});

    yield put(notificationsActions.setLoadingNotifications(false));
    yield put(
      notificationsActions.setNotifications({
        notifications: response?.results || [],
        unseen: response.unseen,
      }),
    );
  } catch (err) {
    yield put(notificationsActions.setLoadingNotifications(false));
    console.log(`\x1b[31m🐣️ saga getNotifications err: `, err, `\x1b[0m`);
  }
}

function* markAsReadAll(): any {
  try {
    // send request to Getstream to mark notification as read without waiting response
    yield notificationsDataHelper.markAsReadAll();

    // get all notifications from store
    const notifications =
      cloneDeep(
        yield select(state => get(state, notificationSelector.notifications)),
      ) || [];

    // then set theirs is_read field by true to un-highlight them directly on device store
    notifications.forEach((item: any) => {
      item.is_read = true;
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

function* markAsSeenAll() {
  try {
    notificationsDataHelper.markAsSeenAll();

    // get all notifications from store
    const notifications: IObject<any> = yield select(state =>
      get(state, notificationSelector.notifications),
    ) || [];

    // then set theirs is_seen field by true
    notifications.forEach((notificationGroup: any) => {
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

function* markAsRead({payload}: {payload: string; type: string}): any {
  try {
    notificationsDataHelper.markAsRead(payload);

    // get all notifications from store
    const notifications: IObject<any> =
      cloneDeep(
        yield select(state => get(state, notificationSelector.notifications)),
      ) || [];

    // then set mapped notificaton's is_read field by true to un-highlight it directly on device store
    notifications.forEach((notificationGroup: any) => {
      if (notificationGroup.id === payload) {
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
function* loadmore() {
  try {
    // show loading more spinner, set isLoadingMore = true
    yield put(notificationsActions.setIsLoadingMore(true));

    // get all notifications from store
    const notifications: IObject<any> =
      (yield select(state => get(state, notificationSelector.notifications))) ||
      [];

    const response: IObject<any> =
      yield notificationsDataHelper.getNotificationList({
        offset: notifications.length + 1,
      });

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
    yield put(notificationsActions.setIsLoadingMore(false));
    console.log('\x1b[33m', '--- load more : error', err, '\x1b[0m');
  }
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
