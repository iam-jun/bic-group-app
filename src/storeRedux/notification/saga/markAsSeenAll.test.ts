/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import modalActions from '../../modal/actions';
import { NOTIFICATIONS_RESPONSE } from '../../../test/mock_data/notifications';
import notificationsDataHelper from '../../../api/NotificationApi';
import notificationsActions from '../actions';
import markAsSeenAll from './markAsSeenAll';

describe('Mark as seen all notification saga', () => {
  const _notificationList: any = {};
  NOTIFICATIONS_RESPONSE.data.list.forEach((item: any) => {
    _notificationList[item.id] = { ...item };
  });
  const storeData = {
    notifications: {
      notificationList: _notificationList,
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

    const newListNoti = { ...storeData.notifications.notificationList };
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(newListNoti)) {
      newListNoti[key as any] = { ...((value as any) || {}), isSeen: true };
    }

    return (
      // @ts-ignorets
      expectSaga(markAsSeenAll, action)
        .provide([
          [matchers.call.fn(notificationsDataHelper.markAsSeenAll), response],
        ])
        .withState(storeData)
        .put(
          notificationsActions.setAllNotifications({
            notifications: { ...newListNoti },
            unseenNumber: 0,
          }),
        )
        .run()
        .then(({ allEffects }: any) => {
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

    // @ts-ignore
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
          props: { isError: true },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });
});
