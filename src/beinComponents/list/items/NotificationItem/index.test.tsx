import {cleanup, fireEvent} from '@testing-library/react-native';
import React from 'react';
import {renderWithRedux} from '~/test/testUtils';
import NotificationItem from '.';
import {
  CHILD_COMMENT,
  LOAD_MORE_RESPONSE,
} from '~/test/mock_data/notifications';

afterEach(cleanup);

describe('NotificationItem component', () => {
  let Platform: any;
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Platform = require('react-native').Platform;
  });

  it(`renders correctly`, async () => {
    const onPress = jest.fn();
    const onPressOption = jest.fn();
    const wrapper = renderWithRedux(
      <NotificationItem
        {...LOAD_MORE_RESPONSE[0]}
        testID={`testID`}
        onPress={onPress}
        onPressOption={onPressOption}
      />,
    );

    const rendered = wrapper.toJSON();
    expect(rendered).toMatchSnapshot();
  });

  it(`should call prop onPress when click item`, async () => {
    const onPress = jest.fn();
    const onPressOption = jest.fn();
    const wrapper = renderWithRedux(
      <NotificationItem
        {...LOAD_MORE_RESPONSE[0]}
        testID={`testID`}
        onPress={onPress}
        onPressOption={onPressOption}
      />,
    );

    const component = wrapper.getByTestId('testID');
    expect(component).toBeDefined();

    fireEvent.press(component);
    expect(onPress).toHaveBeenCalled();
  });

  it(`should call prop onPressOption when click item option menu`, async () => {
    const onPress = jest.fn();
    const onPressOption = jest.fn();
    const wrapper = renderWithRedux(
      <NotificationItem
        {...LOAD_MORE_RESPONSE[0]}
        testID={`testID`}
        onPress={onPress}
        onPressOption={onPressOption}
      />,
    );

    const menuComponent = wrapper.getByTestId(
      'notificationItem.menuIcon.button',
    );
    expect(menuComponent).toBeDefined();

    fireEvent.press(menuComponent);
    expect(onPressOption).toHaveBeenCalled();
  });

  it(`should show indicator when notification is not read`, async () => {
    const onPress = jest.fn();
    const onPressOption = jest.fn();
    const wrapper = renderWithRedux(
      <NotificationItem
        {...LOAD_MORE_RESPONSE[0]}
        testID={`testID`}
        onPress={onPress}
        onPressOption={onPressOption}
      />,
    );
    const component = wrapper.getByTestId('notification_item.indicator');
    expect(component).not.toBeNull();
  });

  it(`should not show indicator when notification is read`, async () => {
    const onPress = jest.fn();
    const onPressOption = jest.fn();
    const wrapper = renderWithRedux(
      <NotificationItem
        {...LOAD_MORE_RESPONSE[0]}
        testID={`testID`}
        onPress={onPress}
        onPressOption={onPressOption}
        isRead={true}
      />,
    );
    const component = wrapper.queryByTestId('notification_item.indicator');
    expect(component).toBeNull();
  });
});
