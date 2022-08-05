import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { NOTIFICATIONS_RESPONSE } from '~/test/mock_data/notifications';

import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import markAsUnRead from './markAsUnRead';

describe('Mark as unread notification saga', () => {
  const _notificationList: any = {};
  NOTIFICATIONS_RESPONSE.data.list.forEach((item: any) => {
    _notificationList[item.id] = { ...item };
  });
  const storeData = {
    notifications: {
      notificationList: _notificationList,
      tabUnread: {
        loading: false,
        data: [],
        isLoadingMore: false,
        noMoreData: false,
      },
    },
  };

  it('should do nothing with params in the payload is undefined', () => {
    const action = {
      type: 'test',
      payload: undefined,
    };
    return (
      // @ts-ignorets
      expectSaga(markAsUnRead, action)
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(0);
        })
    );
  });

  it('should mark as unread notification successfully with params in the payload', () => {
    const action = {
      type: 'test',
      payload: { id: '51898e32-f7a2-411e-beeb-2edd58299010' },
    };
    const response = {
      code: 200,
    };

    const newListNoti = { ...storeData.notifications.notificationList };
    newListNoti[action.payload.id as any].isRead = false;

    return (
      // @ts-ignorets
      expectSaga(markAsUnRead, action)
        .provide([
          [matchers.call.fn(notificationsDataHelper.markAsUnRead), response],
        ])
        .withState(storeData)
        .put(
          notificationsActions.getNotifications({
            flag: 'UNREAD',
            keyValue: 'tabUnread',
          }),
        )
        .put(
          notificationsActions.setAllNotifications({
            notifications: newListNoti,
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should call server and server throws an error this comment is delete', () => {
    const action = {
      type: 'test',
      payload: { id: '51898e32-f7a2-411e-beeb-2edd58299010' },
    };

    const resp = {
      code: 401,
      data: null,
      meta: {
        message: 'Not found',
      },
    };

    // @ts-ignore
    return expectSaga(markAsUnRead, action)
      .provide([
        [
          matchers.call.fn(notificationsDataHelper.markAsUnRead),
          Promise.reject(resp),
        ],
      ])
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });
});
