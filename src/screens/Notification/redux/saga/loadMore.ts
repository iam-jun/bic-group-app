import {get} from 'lodash';
import {put, select, call} from 'redux-saga/effects';

import {IObject} from '~/interfaces/common';
import {IParamGetNotifications} from '~/interfaces/INotification';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

// load more old notifications
function* loadMore({payload}: {payload: IParamGetNotifications; type: string}) {
  try {
    // show loading more spinner, set isLoadingMore = true
    yield put(notificationsActions.setIsLoadingMore(true));

    // get all notifications from store
    const notifications: IObject<any> =
      (yield select(state => get(state, notificationSelector.notifications))) ||
      [];

    const response: IObject<any> = yield call(
      notificationsDataHelper.getNotificationList,
      {
        offset: notifications.length + 1,
        ...payload,
      },
    );

    // hide loading more spinner, set isLoadingMore = false
    yield put(notificationsActions.setIsLoadingMore(false));

    // add loaded notification to bottom of current notification list
    // set noMoreNotification = true if loaded notification is empty
    if (response.results.length > 0) {
      yield put(
        notificationsActions.concatNotifications({
          notifications: response.results,
          unseen: response.unseen,
        }),
      );
    } else {
      yield put(notificationsActions.setNoMoreNoti(true));
    }
  } catch (err) {
    yield put(notificationsActions.setIsLoadingMore(false));
    console.log('\x1b[33m', '--- load more : error', err, '\x1b[0m');
  }
}

export default loadMore;
