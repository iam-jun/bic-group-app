import {expectSaga} from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import modalActions from '~/store/modal/actions';
import {NOTIFICATIONS_RESPONSE} from '~/test/mock_data/notifications';
import notificationsDataHelper from '../../helper/NotificationDataHelper';
import notificationsActions from '../actions';
import markAsSeenAll from './markAsSeenAll';

describe('Mark as seen all notification saga', () => {
  const storeData = {
    notifications: {
      notificationList: NOTIFICATIONS_RESPONSE.data.list,
    },
  };

  it('should mark as seen all notification successfully', () => {
    const action = {
      type: 'test',
      payload: {},
    };
    const response = {
      code: 200,
    };

    const newListNoti = [...storeData.notifications.notificationList];
    newListNoti.forEach((notiItem: any) => {
      notiItem.isSeen = true;
    });

    return (
      // @ts-ignorets
      expectSaga(markAsSeenAll, action)
        .provide([
          [matchers.call.fn(notificationsDataHelper.markAsSeenAll), response],
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
      payload: {},
    };

    const resp = {
      code: 401,
      data: null,
      meta: {
        message: 'Not found',
      },
    };

    //@ts-ignore
    return expectSaga(markAsSeenAll, action)
      .provide([
        [
          matchers.call.fn(notificationsDataHelper.markAsSeenAll),
          Promise.reject(resp),
        ],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: resp.meta.message,
          props: {
            textProps: {useI18n: true},
            type: 'error',
          },
        }),
      )
      .run()
      .then(({allEffects}: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });
});
