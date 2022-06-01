import {get} from 'lodash';
import {call, put, select} from 'redux-saga/effects';

import {IObject} from '~/interfaces/common';
import showError from '~/store/commonSaga/showError';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

function* markAsSeenAll() {
  try {
    yield call(notificationsDataHelper.markAsSeenAll);

    // get all notifications from store
    const notifications: any[] = yield select(state =>
      get(state, notificationSelector.notificationByType('ALL')),
    ) || [];

    // then set theirs is_seen field by true
    notifications.forEach((notificationGroup: any) => {
      notificationGroup.isSeen = true;
    });

    // finally, set notification back to store, and set unseen number to 0 without using Getstream response
    yield put(
      notificationsActions.setNotifications({
        flag: 'ALL',
        data: notifications,
        unseen: 0,
      }),
    );
  } catch (err) {
    console.log('\x1b[33m', 'notification markAsSeenAll error', err, '\x1b[0m');
    yield showError(err);
  }
}

export default markAsSeenAll;
