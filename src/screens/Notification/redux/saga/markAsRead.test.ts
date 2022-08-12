/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { NOTIFICATIONS_RESPONSE } from '~/test/mock_data/notifications';

import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import markAsRead from './markAsRead';

describe('Mark as read notification saga', () => {
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
      expectSaga(markAsRead, action)
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(0);
        })
    );
  });

  it('should mark as read notification successfully with params in the payload', () => {
    const action = {
      type: 'test',
      payload: { id: 'a8679246-8c7a-439d-8114-91810b067b53' },
    };
    const response = {
      code: 200,
    };

    const newListNoti = { ...storeData.notifications.notificationList };
    newListNoti[action.payload.id as any].isRead = true;

    return (
      // @ts-ignorets
      expectSaga(markAsRead, action)
        .provide([
          [matchers.call.fn(notificationsDataHelper.markAsRead), response],
        ])
        .withState(storeData)
        .withState(storeData)
        .put(
          notificationsActions.setNotifications({
            unseen: 0,
            notifications: { ...newListNoti },
            data: [],
            keyValue: 'tabUnread',
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should mark as reading notification successfully when this notification exists in tabUnread', () => {
    const action = {
      type: 'test',
      payload: { id: 'a8679246-8c7a-439d-8114-91810b067b53' },
    };
    const response = {
      code: 200,
    };

    const newStoreData = {
      notifications: {
        notificationList: _notificationList,
        tabUnread: {
          loading: false,
          data: ['0', '1'],
          isLoadingMore: false,
          noMoreData: false,
        },
      },
    };

    const newListNoti = { ...newStoreData.notifications.notificationList };
    newListNoti[action.payload.id as any].isRead = true;

    return (
      // @ts-ignorets
      expectSaga(markAsRead, action)
        .provide([
          [matchers.call.fn(notificationsDataHelper.markAsRead), response],
        ])
        .withState(newStoreData)
        .withState(newStoreData)
        .put(
          notificationsActions.setNotifications({
            unseen: 0,
            notifications: { ...newListNoti },
            data: newStoreData.notifications.tabUnread.data,
            keyValue: 'tabUnread',
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
      payload: { id: 'a8679246-8c7a-439d-8114-91810b067b53' },
    };

    const resp = {
      code: 401,
      data: null,
      meta: {
        message: 'Not found',
      },
    };

    // @ts-ignore
    return expectSaga(markAsRead, action)
      .provide([
        [
          matchers.call.fn(notificationsDataHelper.markAsRead),
          Promise.reject(resp),
        ],
      ])
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });
});
