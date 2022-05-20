import {expectSaga} from 'redux-saga-test-plan';
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
      notificationList: NOTIFICATIONS_RESPONSE.data.list,
    },
  };

  it('should get list notification successfully with params in the payload and cant load more', () => {
    const action = {
      type: 'test',
      payload: {flag: 'ALL'},
    };
    const response = {
      results: [],
      unseen: 0,
    };

    return (
      // @ts-ignorets
      expectSaga(loadMore, action)
        .put(notificationsActions.setIsLoadingMore(true))
        .withState(storeData)
        .provide([
          [
            matchers.call.fn(notificationsDataHelper.getNotificationList),
            response,
          ],
        ])
        .put(notificationsActions.setIsLoadingMore(false))
        .put(notificationsActions.setNoMoreNoti(true))
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(5);
        })
    );
  });

  it('should get list notification successfully with required params in the payload and can load more', () => {
    const action = {
      type: 'test',
      payload: {flag: 'ALL'},
    };
    const response = {
      results: LOAD_MORE_RESPONSE,
      unseen: 0,
    };

    return (
      // @ts-ignorets
      expectSaga(loadMore, action)
        .put(notificationsActions.setIsLoadingMore(true))
        .withState(storeData)
        .provide([
          [
            matchers.call.fn(notificationsDataHelper.getNotificationList),
            response,
          ],
        ])
        .put(notificationsActions.setIsLoadingMore(false))
        .put(
          notificationsActions.concatNotifications({
            notifications: response.results,
            unseen: response.unseen,
          }),
        )
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(5);
        })
    );
  });

  it('should call server and server throws an error this comment is delete', () => {
    const action = {
      type: 'test',
      payload: {flag: 'TEST'},
    };

    const resp = {
      code: 401,
      data: null,
      meta: {
        message: 'Not found',
      },
    };

    //@ts-ignore
    return expectSaga(loadMore, action)
      .put(notificationsActions.setIsLoadingMore(true))
      .withState(storeData)
      .provide([
        [
          matchers.call.fn(notificationsDataHelper.getNotificationList),
          Promise.reject(resp),
        ],
      ])
      .put(notificationsActions.setIsLoadingMore(false))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
