/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import {
  LOAD_MORE_RESPONSE,
  NOTIFICATIONS_RESPONSE,
} from '~/test/mock_data/notifications';

import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import loadMore from './loadMore';

describe('Load more notifications saga', () => {
  const storeData = {
    notifications: {
      notificationList: { ...NOTIFICATIONS_RESPONSE.data.list },
      tabAll: {
        loading: false,
        data: [
          NOTIFICATIONS_RESPONSE.data.list[0].id,
          NOTIFICATIONS_RESPONSE.data.list[1].id,
          NOTIFICATIONS_RESPONSE.data.list[2].id,
        ],
        isLoadingMore: false,
        noMoreData: false,
      },
      tabUnread: {
        loading: false,
        data: [],
        isLoadingMore: false,
        noMoreData: false,
      },
      tabMention: {
        loading: false,
        data: [],
        isLoadingMore: false,
        noMoreData: false,
      },
      tabImportant: {
        loading: false,
        data: [],
        isLoadingMore: false,
        noMoreData: false,
      },
    },
  };

  it('should get list notification successfully with params in the payload and cant load more', () => {
    const keyValue = 'tabAll';
    const action = {
      type: 'test',
      payload: { keyValue },
    };
    const response = {
      results: [],
      unseen: 0,
    };

    return (
      // @ts-ignorets
      expectSaga(loadMore, action)
        .put(notificationsActions.setIsLoadingMore({ keyValue, value: true }))
        .withState(storeData)
        .provide([
          [
            matchers.call.fn(notificationsDataHelper.getNotificationList),
            response,
          ],
        ])
        .put(notificationsActions.setIsLoadingMore({ keyValue, value: false }))
        .put(notificationsActions.setNoMoreNoti({ keyValue, value: true }))
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(5);
        })
    );
  });

  it('should get list notification successfully with required params in the payload and can load more', () => {
    const keyValue = 'tabAll';
    const action = {
      type: 'test',
      payload: { keyValue },
    };
    const response = {
      results: LOAD_MORE_RESPONSE,
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
      expectSaga(loadMore, action)
        .put(notificationsActions.setIsLoadingMore({ keyValue, value: true }))
        .withState(storeData)
        .provide([
          [
            matchers.call.fn(notificationsDataHelper.getNotificationList),
            response,
          ],
        ])
        .put(notificationsActions.setIsLoadingMore({ keyValue, value: false }))
        .put(
          notificationsActions.concatNotifications({
            notifications: newResponse,
            keyValue,
            data: newData,
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
          expect(allEffects?.length).toEqual(5);
        })
    );
  });

  it('should call server and server throws an error this comment is delete', () => {
    const keyValue = 'TEST';
    const action = {
      type: 'test',
      payload: { keyValue },
    };

    const resp = {
      code: 401,
      data: null,
      meta: {
        message: 'Not found',
      },
    };

    // @ts-ignore
    return expectSaga(loadMore, action)
      .put(notificationsActions.setIsLoadingMore({ keyValue, value: true }))
      .withState(storeData)
      .provide([
        [
          matchers.call.fn(notificationsDataHelper.getNotificationList),
          Promise.reject(resp),
        ],
      ])
      .put(notificationsActions.setIsLoadingMore({ keyValue, value: false }))
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
