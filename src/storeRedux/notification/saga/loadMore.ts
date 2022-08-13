import { get } from 'lodash';
import { put, select, call } from 'redux-saga/effects';

import { IObject } from '~/interfaces/common';
import { IParamGetNotifications } from '~/interfaces/INotification';
import notificationsDataHelper from '../../../screens/Notification/helper/NotificationDataHelper';
import notificationsActions from '../actions';
import notificationSelector from '../selector';

// load more old notifications
function* loadMore({
  payload,
}: {
  payload: IParamGetNotifications;
  type: string;
}): any {
  const { keyValue = 'tabAll' } = payload || {};
  try {
    // show loading more spinner, set isLoadingMore = true
    yield put(notificationsActions.setIsLoadingMore({ keyValue, value: true }));

    // get all notifications from store
    const notifications: any[] = (yield select((state) => get(
      state, notificationSelector.notificationByType(keyValue),
    ))) || [];

    const response: IObject<any> = yield call(
      notificationsDataHelper.getNotificationList,
      {
        offset: (notifications?.length || 0) + 1,
        ...payload,
      },
    );

    // hide loading more spinner, set isLoadingMore = false
    yield put(notificationsActions.setIsLoadingMore({ keyValue, value: false }));

    // add loaded notification to bottom of current notification list
    // set noMoreNotification = true if loaded notification is empty
    if (response.results.length > 0) {
      const newData: any[] = [];
      const newResponse: any = {};
      response.results.forEach((item: any) => {
        newData.push(item?.id);
        newResponse[item.id] = { ...item };
      });
      yield put(notificationsActions.concatNotifications({
        notifications: newResponse,
        keyValue,
        data: newData,
      }));
    } else {
      yield put(notificationsActions.setNoMoreNoti({ keyValue, value: true }));
    }
  } catch (err) {
    yield put(notificationsActions.setIsLoadingMore({ keyValue, value: false }));
    console.error(
      '\x1b[33m', '--- load more : error', err, '\x1b[0m',
    );
  }
}

export default loadMore;
