import React from 'react';
import NotificationMenu from './index';
import useNotificationItemMenu from './store';
import { NOTIFICATION_TYPE } from '~/constants/notificationTypes';
import { SpecificNotificationType } from '~/interfaces/INotification';
import { renderWithRedux } from '~/test/testUtils';

describe('NotificationList component', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });

  it('should render corectlly', () => {
    const onCloseItemMenu = jest.fn();
    const handleRemoveNotification = jest.fn();
    const notifMenuRef = React.createRef();

    useNotificationItemMenu.setState((state) => {
      state.enableNotificationSettings = false;
      state.notificationType = NOTIFICATION_TYPE.GROUP_INVITATION;
      state.targetType = SpecificNotificationType.group;
      state.isRead = false;
      state.targetId = '1';
      state.selectedNotificationId = 'selected_id_1';
      state.loading = false;
      return state;
    });

    jest.useFakeTimers();

    const rendered = renderWithRedux(<NotificationMenu
      menuRef={notifMenuRef}
      onClose={onCloseItemMenu}
      handleRemoveNotification={handleRemoveNotification}
    />);

    const itemMarkNoti = rendered.queryByTestId('notification.mark_notification_read_or_unread');
    expect(itemMarkNoti).toBeDefined();

    const itemRemoveNoti = rendered.queryByTestId('notification.remove_notification');
    expect(itemRemoveNoti).toBeDefined();

    const itemSpecificSettings = rendered.queryByTestId('notification.specific_notification_settings');
    expect(itemSpecificSettings).toBeDefined();
  });

  it('should render corectlly with only item mark as read/unread', () => {
    const onCloseItemMenu = jest.fn();
    const handleRemoveNotification = jest.fn();
    const notifMenuRef = React.createRef();

    useNotificationItemMenu.setState((state) => {
      state.enableNotificationSettings = false;
      state.notificationType = NOTIFICATION_TYPE.CHANGE_LOGS;
      state.isRead = true;
      state.loading = false;
      return state;
    });

    jest.useFakeTimers();

    const rendered = renderWithRedux(<NotificationMenu
      menuRef={notifMenuRef}
      onClose={onCloseItemMenu}
      handleRemoveNotification={handleRemoveNotification}
    />);

    const itemMarkNoti = rendered.queryByTestId('notification.mark_notification_read_or_unread');
    expect(itemMarkNoti).toBeDefined();

    const itemRemoveNoti = rendered.queryByTestId('notification.remove_notification');
    expect(itemRemoveNoti).toBeNull();

    const itemSpecificSettings = rendered.queryByTestId('notification.specific_notification_settings');
    expect(itemSpecificSettings).toBeNull();
  });

  it('should render corectlly with 2 item is mark as read/unread and remove', () => {
    const onCloseItemMenu = jest.fn();
    const handleRemoveNotification = jest.fn();
    const notifMenuRef = React.createRef();

    useNotificationItemMenu.setState((state) => {
      state.enableNotificationSettings = false;
      state.notificationType = NOTIFICATION_TYPE.POST_VIDEO_TO_USER_SUCCESSFUL;
      state.isRead = false;
      state.loading = false;
      return state;
    });

    jest.useFakeTimers();

    const rendered = renderWithRedux(<NotificationMenu
      menuRef={notifMenuRef}
      onClose={onCloseItemMenu}
      handleRemoveNotification={handleRemoveNotification}
    />);

    const itemMarkNoti = rendered.queryByTestId('notification.mark_notification_read_or_unread');
    expect(itemMarkNoti).toBeDefined();

    const itemRemoveNoti = rendered.queryByTestId('notification.remove_notification');
    expect(itemRemoveNoti).toBeDefined();

    const itemSpecificSettings = rendered.queryByTestId('notification.specific_notification_settings');
    expect(itemSpecificSettings).toBeNull();
  });
});
