import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import getNotifications from './getNotifications';

describe('Get notifications saga', () => {
  it('should get list notification successfully without params in the payload', () => {
    const action = {
      type: 'test',
      payload: undefined,
    };
    const response = {
      results: [],
      unseen: 0,
    };

    return (
      // @ts-ignorets
      expectSaga(getNotifications, action)
        .put(notificationsActions.setLoadingNotifications(true))
        .put(notificationsActions.setNoMoreNoti(false))
        .provide([
          [
            matchers.call.fn(notificationsDataHelper.getNotificationList),
            response,
          ],
        ])
        .put(notificationsActions.setLoadingNotifications(false))
        .put(
          notificationsActions.setNotifications({
            notifications: response?.results || [],
            unseen: response.unseen,
          }),
        )
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(5);
        })
    );
  });

  it('should get list notification successfully with required params in the payload', () => {
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
      expectSaga(getNotifications, action)
        .put(notificationsActions.setLoadingNotifications(true))
        .put(notificationsActions.setNoMoreNoti(false))
        .provide([
          [
            matchers.call.fn(notificationsDataHelper.getNotificationList),
            response,
          ],
        ])
        .put(notificationsActions.setLoadingNotifications(false))
        .put(
          notificationsActions.setNotifications({
            notifications: response?.results || [],
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
    return expectSaga(getNotifications, action)
      .put(notificationsActions.setLoadingNotifications(true))
      .put(notificationsActions.setNoMoreNoti(false))
      .provide([
        [
          matchers.call.fn(notificationsDataHelper.getNotificationList),
          Promise.reject(resp),
        ],
      ])
      .put(notificationsActions.setLoadingNotifications(false))
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(4);
      });
  });
});
