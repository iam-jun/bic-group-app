import { call, put, select } from 'redux-saga/effects';

import { IObject } from '~/interfaces/common';
import { IParamGetNotifications } from '~/interfaces/INotification';
import notificationsDataHelper from '../../../screens/Notification/helper/NotificationDataHelper';
import notificationsActions from '../actions';

function* getNotifications({
  payload,
}: {
  payload: IParamGetNotifications;
  type: string;
}) {
  const { flag = 'ALL', keyValue = 'tabAll', isRefresh = false } = payload || {};
  try {
    if (!isRefresh) {
      yield put(notificationsActions.setLoadingNotifications({ keyValue, value: true }));
    }
    yield put(notificationsActions.setNoMoreNoti({ keyValue, value: false }));

    const response: IObject<any> = yield call(
      notificationsDataHelper.getNotificationList,
      payload || {},
    );

    if (flag === 'UNREAD' && response?.results?.length < 1) {
      const joinedCommunities: IObject<any> = yield select((state: any) => state.groups.joinedCommunities.data);
      if (joinedCommunities?.length > 0) {
        const _response: IObject<any> = yield call(
          notificationsDataHelper.getNotificationList,
          { flag: 'ALL' },
        );
        if (_response?.results?.length > 1) {
          yield put(notificationsActions.setNoMoreNoti({ keyValue, value: true }));
        }
      }
    }

    if (response?.results?.length > 0) {
      const newData: any[] = [];
      const newResponse: any = {};
      response.results.forEach((item: any) => {
        newData.push(item?.id);
        newResponse[item.id] = { ...item };
      });
      yield put(notificationsActions.setNotifications({
        notifications: newResponse,
        keyValue,
        data: newData,
        unseen: response.unseen,
      }));
    }

    if (!isRefresh) {
      yield put(notificationsActions.setLoadingNotifications({ keyValue, value: false }));
    }
  } catch (err) {
    yield put(notificationsActions.setLoadingNotifications({
      keyValue,
      value: false,
    }));
    console.error(
      '\x1b[31m🐣️ saga getNotifications err: ', err, '\x1b[0m',
    );
  }
}

export default getNotifications;
