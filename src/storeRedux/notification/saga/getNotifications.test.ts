/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { NOTIFICATIONS_RESPONSE } from '../../../test/mock_data/notifications';

import notificationsDataHelper from '../../../screens/Notification/helper/NotificationDataHelper';
import notificationsActions from '../actions';
import getNotifications from './getNotifications';

describe('Get notifications saga', () => {
  const storeData = {
    notifications: {
      notificationList: { ...NOTIFICATIONS_RESPONSE.data.list },
      tabAll: {
        loading: false,
        data: [],
        isLoadingMore: false,
        noMoreData: false,
      },
      tabUnread: {
        loading: false,
        data: [],
        isLoadingMore: false,
        noMoreData: false,
      },
    },
    groups: {
      joinedCommunities: { data: [1] },
    },
  };

  it('should get list notification successfully without params in the payload', () => {
    const action = {
      type: 'test',
      payload: undefined,
    };
    const response = {
      results: [],
      unseen: 0,
    };
    const keyValue = 'tabAll';

    return (
      // @ts-ignorets
      expectSaga(getNotifications, action)
        .put(
          notificationsActions.setLoadingNotifications({
            keyValue,
            value: true,
          }),
        )
        .put(notificationsActions.setNoMoreNoti({ keyValue, value: false }))
        .provide([
          [
            matchers.call.fn(notificationsDataHelper.getNotificationList),
            response,
          ],
        ])
        .put(
          notificationsActions.setLoadingNotifications({
            keyValue,
            value: false,
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(4);
        })
    );
  });

  it('should get list notification successfully with required params in the payload', () => {
    const keyValue = 'tabAll';
    const action = {
      type: 'test',
      payload: { flag: 'ALL', keyValue },
    };
    const response = {
      results: NOTIFICATIONS_RESPONSE.data.list,
      unseen: 0,
    };

    const newData: any[] = [];
    const newResponse: any = {};
    response.results.forEach((item: any) => {
      newData.push(item?.id);
      newResponse[item.id] = { ...item };
    });

    return (
      // @ts-ignorets
      expectSaga(getNotifications, action)
        .put(
          notificationsActions.setLoadingNotifications({
            keyValue,
            value: true,
          }),
        )
        .put(
          notificationsActions.setNoMoreNoti({
            keyValue,
            value: false,
          }),
        )
        .provide([
          [
            matchers.call.fn(notificationsDataHelper.getNotificationList),
            response,
          ],
        ])
        .put(
          notificationsActions.setNotifications({
            notifications: newResponse,
            keyValue,
            data: newData,
            unseen: response.unseen,
          }),
        )
        .put(
          notificationsActions.setLoadingNotifications({
            keyValue,
            value: false,
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(5);
        })
    );
  });

  it('should call server and server throws an error this comment is delete', () => {
    const action = {
      type: 'test',
      payload: { flag: 'TEST', keyValue: 'tabAll' },
    };

    const resp = {
      code: 401,
      data: null,
      meta: {
        message: 'Not found',
      },
    };

    // @ts-ignore
    return expectSaga(getNotifications, action)
      .put(
        notificationsActions.setLoadingNotifications({
          keyValue: 'tabAll',
          value: true,
        }),
      )
      .put(
        notificationsActions.setNoMoreNoti({
          keyValue: 'tabAll',
          value: false,
        }),
      )
      .provide([
        [
          matchers.call.fn(notificationsDataHelper.getNotificationList),
          Promise.reject(resp),
        ],
      ])
      .put(
        notificationsActions.setLoadingNotifications({
          keyValue: 'tabAll',
          value: false,
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });

  it('should get list notification successfully with isRefresh= true', () => {
    const keyValue = 'tabAll';
    const action = {
      type: 'test',
      payload: { flag: 'ALL', keyValue, isRefresh: true },
    };
    const response = {
      results: NOTIFICATIONS_RESPONSE.data.list,
      unseen: 0,
    };

    const newData: any[] = [];
    const newResponse: any = {};
    response.results.forEach((item: any) => {
      newData.push(item?.id);
      newResponse[item.id] = { ...item };
    });

    return (
      // @ts-ignorets
      expectSaga(getNotifications, action)
        .put(
          notificationsActions.setNoMoreNoti({
            keyValue,
            value: false,
          }),
        )
        .provide([
          [
            matchers.call.fn(notificationsDataHelper.getNotificationList),
            response,
          ],
        ])
        .put(
          notificationsActions.setNotifications({
            notifications: newResponse,
            keyValue,
            data: newData,
            unseen: response.unseen,
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(3);
        })
    );
  });

  it('should get list notification successfully with flag = UNREAD', () => {
    const keyValue = 'tabUnread';
    const action = {
      type: 'test',
      payload: { flag: 'UNREAD', keyValue },
    };
    const response = {
      results: [],
      unseen: 0,
    };

    return (
      // @ts-ignorets
      expectSaga(getNotifications, action)
        .put(
          notificationsActions.setLoadingNotifications({
            keyValue,
            value: true,
          }),
        )
        .put(notificationsActions.setNoMoreNoti({ keyValue, value: false }))
        .provide([
          [
            matchers.call.fn(notificationsDataHelper.getNotificationList),
            response,
          ],
        ])
        .withState(storeData)
        .put(
          notificationsActions.setLoadingNotifications({
            keyValue,
            value: false,
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(6);
        })
    );
  });
});
