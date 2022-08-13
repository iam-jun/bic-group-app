import * as React from 'react';
import { cleanup, fireEvent } from '@testing-library/react-native';

import NotificationOptionBottomSheet from './NotificationOptionBottomSheet';
import { renderWithRedux } from '~/test/testUtils';
import notificationsActions from '../../../storeRedux/notification/actions';
import * as modalActions from '~/storeRedux/modal/actions';
import { NOTIFICATIONS_RESPONSE } from '~/test/mock_data/notifications';

afterEach(cleanup);

describe('NotificationOptionBottomSheet component', () => {
  const baseSheetRef = jest.fn();
  const notificationData = NOTIFICATIONS_RESPONSE.data.list;

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <NotificationOptionBottomSheet
        data={notificationData[0]}
        modalizeRef={baseSheetRef}
      />,
    ).toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it('should called markAsUnRead action when click mark as unread item', () => {
    const spy = jest.spyOn(notificationsActions, 'markAsUnRead');
    const rendered = renderWithRedux(
      <NotificationOptionBottomSheet
        data={notificationData[0]}
        modalizeRef={baseSheetRef}
      />,
    );
    const markAllAsReadComponent = rendered.getByTestId(
      'notification.mark_notification_read_or_unread',
    );
    expect(markAllAsReadComponent).toBeDefined();
    fireEvent.press(markAllAsReadComponent);

    expect(spy).toBeCalled();
  });

  it('should called markAsRead action when click mark as read item', () => {
    const spy = jest.spyOn(notificationsActions, 'markAsRead');
    const rendered = renderWithRedux(
      <NotificationOptionBottomSheet
        data={notificationData[1]}
        modalizeRef={baseSheetRef}
      />,
    );
    const markAllAsReadComponent = rendered.getByTestId(
      'notification.mark_notification_read_or_unread',
    );
    expect(markAllAsReadComponent).toBeDefined();
    fireEvent.press(markAllAsReadComponent);

    expect(spy).toBeCalled();
  });

  it('should called showAlertNewFeature action when click notification setting item', () => {
    const spy = jest.spyOn(modalActions, 'showAlertNewFeature');
    const rendered = renderWithRedux(
      <NotificationOptionBottomSheet
        data={notificationData[0]}
        modalizeRef={baseSheetRef}
      />,
    );
    const notificationSettingComponent = rendered.getByTestId(
      'notification.off_notification_from_group',
    );
    expect(notificationSettingComponent).toBeDefined();
    fireEvent.press(notificationSettingComponent);

    expect(spy).toBeCalled();
  });
});
