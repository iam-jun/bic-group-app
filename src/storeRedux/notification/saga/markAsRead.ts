import { cloneDeep, get } from 'lodash';
import { call, put, select } from 'redux-saga/effects';

import notificationsDataHelper from '../../../api/NotificationApi';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsRead({ payload }: {payload: any; type: string}): any {
  try {
    const { id } = payload || {};
    if (!id) return;

    yield call(
      notificationsDataHelper.markAsRead, id,
    );

    // get all notifications from store
    const notifications: any = cloneDeep(yield select((state) => get(
      state, notificationSelector.notifications,
    ))) || {};

    notifications[id].isRead = true;

    const tabUnreadData: any[] = cloneDeep(yield select((state) => get(
      state, notificationSelector.notificationByType('tabUnread'),
    ))) || [];
    let newData = [];
    if (tabUnreadData?.length > 0) {
      newData = tabUnreadData.filter((item: any) => item !== id);
    }

    // finally, set notification back to store,
    yield put(notificationsActions.setNotifications({
      unseen: 0,
      notifications: { ...notifications },
      data: newData,
      keyValue: 'tabUnread',
    }));
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification markAsRead error', err, '\x1b[0m',
    );
  }
}

export default markAsRead;
