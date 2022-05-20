import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import {NOTIFICATIONS_RESPONSE} from '~/test/mock_data/notifications';

import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import markAsRead from './markAsRead';

describe('Mark as read notification saga', () => {
  const storeData = {
    notifications: {
      notificationList: NOTIFICATIONS_RESPONSE.data.list,
    },
  };

  it('should mark as read notification successfully with params in the payload', () => {
    const action = {
      type: 'test',
      payload: 'a8679246-8c7a-439d-8114-91810b067b53',
    };
    const response = {
      code: 200,
    };

    const newListNoti = [...storeData.notifications.notificationList];
    newListNoti.forEach((notificationGroup: any) => {
      if (notificationGroup.id === action.payload) {
        notificationGroup.isRead = true;
      }
    });

    return (
      // @ts-ignorets
      expectSaga(markAsRead, action)
        .provide([
          [matchers.call.fn(notificationsDataHelper.markAsRead), response],
        ])
        .withState(storeData)
        .put(
          notificationsActions.setNotifications({
            notifications: newListNoti,
            unseen: 0,
          }),
        )
        .run()
        .then(({allEffects}: any) => {
          expect(allEffects?.length).toEqual(3);
        })
    );
  });

  it('should call server and server throws an error this comment is delete', () => {
    const action = {
      type: 'test',
      payload: 'a8679246-8c7a-439d-8114-91810b067b53',
    };

    const resp = {
      code: 401,
      data: null,
      meta: {
        message: 'Not found',
      },
    };

    //@ts-ignore
    return expectSaga(markAsRead, action)
      .provide([
        [
          matchers.call.fn(notificationsDataHelper.markAsRead),
          Promise.reject(resp),
        ],
      ])
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(1);
      });
  });
});
