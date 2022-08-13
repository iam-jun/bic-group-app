import { cloneDeep, get } from 'lodash';
import { put, select, call } from 'redux-saga/effects';

import showError from '~/storeRedux/commonSaga/showError';
import * as modalActions from '~/storeRedux/modal/actions';
import notificationsDataHelper from '../../../screens/Notification/helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsReadAll({ payload }: {payload: string; type: string}): any {
  try {
    // send request to Getstream to mark notification as read without waiting response
    yield call(
      notificationsDataHelper.markAsReadAll, payload,
    );

    // get all notifications from store
    const notifications: any = cloneDeep(yield select((state) => get(
      state, notificationSelector.notifications,
    ))) || {};

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(notifications)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      notifications[key] = { ...((value as any) || {}), isRead: true };
    }

    // finally, set notification back to store,
    yield put(notificationsActions.setNotifications({
      notifications: { ...notifications },
      keyValue: 'tabUnread',
      data: [],
      unseen: 0,
    }));

    yield put(modalActions.showHideToastMessage({
      content: 'notification:mark_all_as_read_success',
      props: {
        textProps: { useI18n: true },
        type: 'success',
      },
    }));
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification markAsReadAll error', err, '\x1b[0m',
    );
    yield showError(err);
  }
}

export default markAsReadAll;
