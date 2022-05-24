import {call, put} from 'redux-saga/effects';

import {IObject} from '~/interfaces/common';
import {IParamGetNotifications} from '~/interfaces/INotification';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';

function* getNotifications({
  payload,
}: {
  payload: IParamGetNotifications;
  type: string;
}) {
  try {
    yield put(notificationsActions.setLoadingNotifications(true));
    yield put(notificationsActions.setNoMoreNoti(false));

    const response: IObject<any> = yield call(
      notificationsDataHelper.getNotificationList,
      payload || {},
    );

    yield put(notificationsActions.setLoadingNotifications(false));
    yield put(
      notificationsActions.setNotifications({
        notifications: response?.results || [],
        unseen: response.unseen,
      }),
    );
  } catch (err) {
    yield put(notificationsActions.setLoadingNotifications(false));
    console.log(`\x1b[31m🐣️ saga getNotifications err: `, err, `\x1b[0m`);
  }
}

export default getNotifications;
