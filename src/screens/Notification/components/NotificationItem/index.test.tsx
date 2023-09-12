/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import NotificationItem from './index';
import { mockNotifications } from '~/test/mock_data/notifications';
import useNotificationStore from '~/screens/Notification/store';

const testID = 'notification';
const id = 'aa2f1634-e690-4ee7-a9f0-42aaf3f97314';

describe('NotificationItem component', () => {
  it('should render null when id is empty', () => {
    const onPress = jest.fn();
    const onPressOption = jest.fn();

    const wrapper = renderWithRedux(
      <NotificationItem
        id=""
        testID={testID}
        onPress={onPress}
        onPressOption={onPressOption}
      />,
    );

    const component = wrapper.queryByTestId(testID);
    expect(component).toBeNull();
  });

  it('renders correctly when notification is not empty', () => {
    const onPress = jest.fn();
    const onPressOption = jest.fn();

    useNotificationStore.setState((state) => {
      state.notificationList = { 'aa2f1634-e690-4ee7-a9f0-42aaf3f97314': { ...mockNotifications[0] } };
      return state;
    });

    const wrapper = renderWithRedux(
      <NotificationItem
        id={id}
        testID={testID}
        onPress={onPress}
        onPressOption={onPressOption}
      />,
    );

    const component = wrapper.queryByTestId(testID);
    expect(component).toBeDefined();
    fireEvent.press(component);
    expect(onPress).toHaveBeenCalled();

    const avatarComponent = wrapper.queryByTestId('notification.avatars');
    expect(avatarComponent).toBeDefined();

    const optionComponent = wrapper.queryByTestId('notification.menu_button');
    expect(optionComponent).toBeDefined();
    fireEvent.press(optionComponent);
    expect(onPressOption).toHaveBeenCalled();
  });

  it('renders correctly when notification is not empty and not show avatar', () => {
    const notiIdNotShowAvatar = 'edf27208-6def-48d7-9479-7d054da6a5cc';
    const onPress = jest.fn();
    const onPressOption = jest.fn();

    useNotificationStore.setState((state) => {
      state.notificationList = { 'edf27208-6def-48d7-9479-7d054da6a5cc': { ...mockNotifications[1] } };
      return state;
    });

    const wrapper = renderWithRedux(
      <NotificationItem
        id={notiIdNotShowAvatar}
        testID={testID}
        onPress={onPress}
        onPressOption={onPressOption}
      />,
    );

    const component = wrapper.queryByTestId(testID);
    expect(component).toBeDefined();

    const avatarComponent = wrapper.queryByTestId('notification.avatars');
    expect(avatarComponent).toBeNull();
  });
});
