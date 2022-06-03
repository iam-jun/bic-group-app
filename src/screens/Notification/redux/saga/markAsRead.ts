import {cloneDeep, get} from 'lodash';
import {call, put, select} from 'redux-saga/effects';

import {IObject} from '~/interfaces/common';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsRead({payload}: {payload: any; type: string}): any {
  try {
    const {id} = payload || {};
    yield call(notificationsDataHelper.markAsRead, id);

    // get all notifications from store
    const notifications: IObject<any> =
      cloneDeep(
        yield select(state => get(state, notificationSelector.notifications)),
      ) || {};

    const newNotifications: any = {};
    for (const [key, value] of Object.entries(notifications)) {
      const _data = value?.data || [];
      if (key === 'UNREAD') {
        const newData = _data.filter((item: any) => item?.id !== id);
        newNotifications[key] = {...value, data: newData};
      } else {
        // then set mapped notificaton's is_read field by true to un-highlight it directly on device store
        for (let index = 0; index < _data.length; index++) {
          if (_data[index].id === id) {
            _data[index].isRead = true;
            break;
          }
        }
        newNotifications[key] = {...value, data: _data};
      }
    }

    // finally, set notification back to store,
    yield put(notificationsActions.setAllNotifications(newNotifications));
  } catch (err) {
    console.log('\x1b[33m', 'notification markAsRead error', err, '\x1b[0m');
  }
}

export default markAsRead;
