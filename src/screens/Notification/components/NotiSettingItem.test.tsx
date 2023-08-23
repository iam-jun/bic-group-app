import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import NotiSettingItem from './NotiSettingItem';

describe('Notification Setting Item Component', () => {
  const mockCommentData = {
    name: 'comment',
    title: 'Comments',
    subtitle: 'These are notifications for when someone comments on your content or replies to your comment.',
    enable: true,
    channels: {
      in_app: true,
      push: true,
    },
    order: 2,
  };

  const mockGenericData = {
    name: 'generic',
    title: 'Allow notifications',
    enable: true,
    order: 1,
  };
  it('should render correctly and call prop onPress', () => {
    const handlePressItem = jest.fn();

    const wrapper = renderWithRedux(
      <NotiSettingItem
        item={mockCommentData}
        iconName="MessageDots"
        onPress={handlePressItem}
      />,
    );

    const itemComponent = wrapper.getByTestId('notification_settings.item');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);

    expect(handlePressItem).toBeCalled();
  });

  it('should render correctly and call prop onPress', () => {
    const onPressToggle = jest.fn();

    const wrapper = renderWithRedux(
      <NotiSettingItem
        item={mockGenericData}
        iconName="Bell"
        onPressToggle={onPressToggle}
      />,
    );

    const toggleComponent = wrapper.getByTestId('notification_settings.item.toggle');
    expect(toggleComponent).toBeDefined();
    fireEvent.press(toggleComponent);

    expect(onPressToggle).toBeCalled();
  });

  it('should render correctly when not pass prop onPressToggle to component', () => {
    const handlePressItem = jest.fn();

    const wrapper = renderWithRedux(
      <NotiSettingItem
        item={mockCommentData}
        iconName="MessageDots"
        onPress={handlePressItem}
      />,
    );

    const toggleComponent = wrapper.queryByTestId('notification_settings.item.toggle');
    expect(toggleComponent).toBeNull();

    const iconChevronRightComponent = wrapper.getByTestId('notification_settings.item.icon');
    expect(iconChevronRightComponent).toBeDefined();
  });

  it('should render correctly when item is disable', () => {
    const handlePressItem = jest.fn();

    const wrapper = renderWithRedux(
      <NotiSettingItem
        isDisable
        item={mockCommentData}
        iconName="MessageDots"
        onPress={handlePressItem}
      />,
    );

    const itemComponent = wrapper.getByTestId('notification_settings.item');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);

    expect(handlePressItem).not.toBeCalled();

    const iconChevronRightComponent = wrapper.getByTestId('notification_settings.item.icon');
    expect(iconChevronRightComponent).toBeDefined();
  });

  it('should render correctly when toggle of item is disable', () => {
    const onPressToggle = jest.fn();

    const wrapper = renderWithRedux(
      <NotiSettingItem
        isDisableToggle
        item={mockCommentData}
        iconName="MessageDots"
        onPressToggle={onPressToggle}
      />,
    );

    const toggleComponent = wrapper.getByTestId('notification_settings.item');
    expect(toggleComponent).toBeDefined();
    fireEvent.press(toggleComponent);
    expect(onPressToggle).not.toBeCalled();
  });

  it('should render correctly if isShowSubTitle = true', () => {
    const onPressToggle = jest.fn();

    const wrapper = renderWithRedux(
      <NotiSettingItem
        isShowSubTitle
        item={mockCommentData}
        iconName="MessageDots"
        onPressToggle={onPressToggle}
      />,
    );

    const subTitleComponent = wrapper.getByTestId('notification_settings.item.sub_title');
    expect(subTitleComponent).toBeDefined();
  });
});
