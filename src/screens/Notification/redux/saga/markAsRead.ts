import {cloneDeep, get} from 'lodash';
import {call, put, select} from 'redux-saga/effects';

import {IObject} from '~/interfaces/common';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsRead({payload}: {payload: any; type: string}): any {
  try {
    const {id, flag} = payload || {};
    yield call(notificationsDataHelper.markAsRead, id);

    // get all notifications from store
    const notifications: IObject<any> =
      cloneDeep(
        yield select(state => get(state, notificationSelector.notifications)),
      ) || [];

    let newNotifications = [];
    if (flag === 'UNREAD') {
      newNotifications = notifications.filter((item: any) => item?.id !== id);
    } else {
      // then set mapped notificaton's is_read field by true to un-highlight it directly on device store
      notifications.forEach((notificationGroup: any) => {
        if (notificationGroup.id === id) {
          notificationGroup.isRead = true;
        }
      });
    }

    // finally, set notification back to store,
    yield put(
      notificationsActions.setNotifications({
        notifications: flag === 'UNREAD' ? newNotifications : notifications,
        unseen: 0, // hardcode because we re-use setNotifications function
      }),
    );
  } catch (err) {
    console.log('\x1b[33m', 'notification markAsRead error', err, '\x1b[0m');
  }
}

export default markAsRead;
