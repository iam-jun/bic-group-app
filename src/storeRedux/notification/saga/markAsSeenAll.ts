import { cloneDeep, get } from 'lodash';
import { call, put, select } from 'redux-saga/effects';

import showError from '~/storeRedux/commonSaga/showError';
import notificationsDataHelper from '../../../api/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsSeenAll(): any {
  try {
    yield call(notificationsDataHelper.markAsSeenAll);

    // get all notifications from store
    const notifications: any = cloneDeep(yield select((state) => get(
      state, notificationSelector.notifications,
    ))) || {};

    // then set theirs isSeen field by true
    Object.keys(notifications).forEach((key) => {
      notifications[key] = { ...notifications[key], isSeen: true };
    });

    // finally, set notification back to store, and set unseen number to 0 without using Getstream response
    yield put(notificationsActions.setAllNotifications({
      notifications: { ...notifications },
      unseenNumber: 0,
    }));
  } catch (err) {
    console.error(
      '\x1b[33m', 'notification markAsSeenAll error', err, '\x1b[0m',
    );
    yield showError(err);
  }
}

export default markAsSeenAll;
