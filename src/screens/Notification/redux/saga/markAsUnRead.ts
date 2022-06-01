import {cloneDeep, get} from 'lodash';
import {call, put, select} from 'redux-saga/effects';

import {IObject} from '~/interfaces/common';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsUnRead({payload}: {payload: any; type: string}): any {
  try {
    yield call(notificationsDataHelper.markAsUnRead, payload?.id || '');

    // get all notifications from store
    const notifications: IObject<any> =
      cloneDeep(
        yield select(state => get(state, notificationSelector.notifications)),
      ) || {};

    const newNotifications: any = {};
    for (const [key, value] of Object.entries(notifications)) {
      const _data = value?.data || [];
      if (key === 'UNREAD') {
        const newData = _data.filter((item: any) => item?.id !== payload?.id);
        newData.push({...payload, isRead: false});
        const dataSorted = sortNotifications(newData);
        newNotifications[key] = {...value, data: dataSorted};
      } else {
        // then set mapped notificaton's isRead field by false to un-highlight it directly on device store
        _data.forEach((item: any) => {
          if (item.id === payload?.id) {
            item.isRead = false;
          }
        });
        newNotifications[key] = {...value, data: _data};
      }
    }

    // finally, set notification back to store,
    yield put(notificationsActions.setAllNotifications(newNotifications));
  } catch (err) {
    console.log('\x1b[33m', 'notification markAsUnRead error', err, '\x1b[0m');
  }
}

const sortNotifications = (notifications: any[]) => {
  const newNotifications: any = notifications?.sort?.((n1: any, n2: any) =>
    n1?.updatedAt && n2?.updatedAt && n1?.updatedAt < n2?.updatedAt ? 1 : -1,
  );
  return newNotifications;
};

export default markAsUnRead;
