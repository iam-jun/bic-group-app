import {cloneDeep, get} from 'lodash';
import {call, put, select} from 'redux-saga/effects';

import {IObject} from '~/interfaces/common';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsUnRead({payload}: {payload: string; type: string}): any {
  try {
    yield call(notificationsDataHelper.markAsUnRead, payload);

    // get all notifications from store
    const notifications: IObject<any> =
      cloneDeep(
        yield select(state => get(state, notificationSelector.notifications)),
      ) || [];

    // then set mapped notificaton's isRead field by false to un-highlight it directly on device store
    notifications.forEach((notificationGroup: any) => {
      if (notificationGroup.id === payload) {
        notificationGroup.isRead = false;
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
    console.log('\x1b[33m', 'notification markAsUnRead error', err, '\x1b[0m');
  }
}

export default markAsUnRead;
