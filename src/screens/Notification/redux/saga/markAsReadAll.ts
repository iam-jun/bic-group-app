import {cloneDeep, get} from 'lodash';
import {put, select, call} from 'redux-saga/effects';
import {IObject} from '~/interfaces/common';

import showError from '~/store/commonSaga/showError';
import * as modalActions from '~/store/modal/actions';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsReadAll({payload}: {payload: string; type: string}) {
  try {
    // send request to Getstream to mark notification as read without waiting response
    yield call(notificationsDataHelper.markAsReadAll);

    if (payload === 'UNREAD') {
      const noMoreNotification: boolean = yield select(state =>
        get(state, notificationSelector.noMoreNotification),
      );
      yield put(
        notificationsActions.setNotifications({
          notifications: [],
          unseen: 0, // hardcode because we re-use setNotifications function
        }),
      );
      if (!noMoreNotification) {
        yield put(notificationsActions.getNotifications({flag: 'UNREAD'}));
      } else {
        yield put(notificationsActions.setNoMoreNoti(true));
      }
    } else {
      // get all notifications from store
      const notifications: IObject<any> =
        cloneDeep(
          yield select(state => get(state, notificationSelector.notifications)),
        ) || [];

      // then set theirs is_read field by true to un-highlight them directly on device store
      notifications.forEach((item: any) => {
        item.isRead = true;
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
    }
  } catch (err) {
    console.log('\x1b[33m', 'notification markAsReadAll error', err, '\x1b[0m');
    yield showError(err);
  }
}

export default markAsReadAll;
