import {cloneDeep, get} from 'lodash';
import {put, select, call} from 'redux-saga/effects';
import {IObject} from '~/interfaces/common';

import showError from '~/store/commonSaga/showError';
import * as modalActions from '~/store/modal/actions';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsReadAll({payload}: {payload: string; type: string}): any {
  try {
    // send request to Getstream to mark notification as read without waiting response
    yield call(notificationsDataHelper.markAsReadAll, payload);

    // get all notifications from store
    const notifications: IObject<any> =
      cloneDeep(
        yield select(state => get(state, notificationSelector.notifications)),
      ) || {};

    const newNotifications: any = {};
    for (const [key, value] of Object.entries(notifications)) {
      const _data = value?.data || [];
      if (key === 'UNREAD') {
        newNotifications[key] = {...value, data: []};
      } else {
        // then set mapped notificaton's is_read field by true to un-highlight it directly on device store
        _data.forEach((item: any) => {
          item.isRead = true;
        });
        newNotifications[key] = {...value, data: _data};
      }
    }

    // finally, set notification back to store,
    yield put(notificationsActions.setAllNotifications(newNotifications));

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

export default markAsReadAll;
