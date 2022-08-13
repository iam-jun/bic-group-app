/* eslint-disable @typescript-eslint/ban-ts-comment */
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';

import modalActions from '../../modal/actions';
import { NOTIFICATIONS_RESPONSE } from '../../../test/mock_data/notifications';
import notificationsDataHelper from '../../../api/NotificationDataHelper';
import notificationsActions from '../actions';
import markAsReadAll from './markAsReadAll';

describe('Mark as read all notification saga', () => {
  const _notificationList: any = {};
  NOTIFICATIONS_RESPONSE.data.list.forEach((item: any) => {
    _notificationList[item.id] = { ...item };
  });
  const storeData = {
    notifications: {
      notificationList: _notificationList,
    },
  };

  it('should mark as read all notification successfully', () => {
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
      newListNoti[key as any] = { ...((value as any) || {}), isRead: true };
    }

    return (
      // @ts-ignorets
      expectSaga(markAsReadAll, action)
        .provide([
          [matchers.call.fn(notificationsDataHelper.markAsReadAll), response],
        ])
        .withState(storeData)
        .put(
          notificationsActions.setNotifications({
            notifications: newListNoti,
            keyValue: 'tabUnread',
            data: [],
            unseen: 0,
          }),
        )
        .put(
          modalActions.showHideToastMessage({
            content: 'notification:mark_all_as_read_success',
            props: {
              textProps: { useI18n: true },
              type: 'success',
            },
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
    return expectSaga(markAsReadAll, action)
      .provide([
        [
          matchers.call.fn(notificationsDataHelper.markAsReadAll),
          Promise.reject(resp),
        ],
      ])
      .put(
        modalActions.showHideToastMessage({
          content: resp.meta.message,
          props: {
            textProps: { useI18n: true },
            type: 'error',
          },
        }),
      )
      .run()
      .then(({ allEffects }: any) => {
        expect(allEffects?.length).toEqual(2);
      });
  });
});
