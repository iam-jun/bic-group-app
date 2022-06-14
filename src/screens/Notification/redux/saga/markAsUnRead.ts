import {cloneDeep, get} from 'lodash';
import {call, put, select} from 'redux-saga/effects';

import {IObject} from '~/interfaces/common';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsUnRead({payload}: {payload: any; type: string}): any {
  try {
    if (!payload?.id) return;
    yield call(notificationsDataHelper.markAsUnRead, payload.id);

    // get all notifications from store
    const notifications: any =
      cloneDeep(
        yield select(state => get(state, notificationSelector.notifications)),
      ) || {};

    notifications[payload.id].isRead = false;

    //call api to refresh unread tab
    yield put(
      notificationsActions.getNotifications({
        flag: 'UNREAD',
        keyValue: 'tabUnread',
      }),
    );

    // finally, set notification back to store,
    yield put(
      notificationsActions.setAllNotifications({
        notifications: {...notifications},
      }),
    );
  } catch (err) {
    console.log('\x1b[33m', 'notification markAsUnRead error', err, '\x1b[0m');
  }
}

export default markAsUnRead;
