import {call, put, select} from 'redux-saga/effects';

import {IObject} from '~/interfaces/common';
import {IParamGetNotifications} from '~/interfaces/INotification';
import groupsActions from '~/screens/Groups/redux/actions';
import {timeOut} from '~/utils/common';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';

function* getNotifications({
  payload,
}: {
  payload: IParamGetNotifications;
  type: string;
}) {
  try {
    const {flag = 'ALL'} = payload || {};
    yield put(
      notificationsActions.setLoadingNotifications({flag, value: true}),
    );
    yield put(notificationsActions.setNoMoreNoti({flag, value: false}));

    const response: IObject<any> = yield call(
      notificationsDataHelper.getNotificationList,
      payload || {},
    );
    console.log('111111111111111111', flag);

    if (flag === 'UNREAD' && response?.results?.length < 1) {
      yield put(groupsActions.getMyCommunities({}));
      yield timeOut(500);
      const joinedCommunities: IObject<any> = yield select(
        (state: any) => state.groups.joinedCommunities.data,
      );
      if (joinedCommunities?.length > 0) {
        const _response: IObject<any> = yield call(
          notificationsDataHelper.getNotificationList,
          {flag: 'ALL'},
        );
        if (_response?.results?.length > 1) {
          yield put(notificationsActions.setNoMoreNoti({flag, value: true}));
        }
      }
    }

    console.log('22222222222222222', flag);
    yield put(
      notificationsActions.setNotifications({
        flag: flag,
        data: response?.results || [],
        unseen: response.unseen,
      }),
    );
    console.log('3333333333333333', flag);
    yield put(
      notificationsActions.setLoadingNotifications({flag, value: false}),
    );
  } catch (err) {
    yield put(
      notificationsActions.setLoadingNotifications({
        flag: payload.flag,
        value: false,
      }),
    );
    console.log(`\x1b[31m🐣️ saga getNotifications err: `, err, `\x1b[0m`);
  }
}

export default getNotifications;
