import React from 'react';
import { renderWithRedux, act, fireEvent } from '../../../test/testUtils';
import NotificationList from './NotificationList';
import { notificationMenuData } from '../constants';
import notificationApi from '~/api/NotificationApi';
import useNotificationStore from '../store';
import { mockNotifications } from '~/test/mock_data/notifications';

describe('NotificationList component', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
  it('should render empty screen if get notifications successfully with no data', () => {
    const onItemPress = jest.fn();
    const onPressItemOption = jest.fn();
    const onRefresh = jest.fn();
    const response = {
      code: 200,
      results: [],
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const rendered = renderWithRedux(<NotificationList
      activeIndex
      type={notificationMenuData[0].type}
      keyValue={notificationMenuData[0].key}
      onRefresh={onRefresh}
      onPressItemOption={onPressItemOption}
      onItemPress={onItemPress}
    />);

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();

    const emptyComponent = rendered.queryByTestId('notification_screen.empty');
    expect(emptyComponent).toBeDefined();
  });

  it('should render loading screen if loading when call api get notifications', () => {
    const onItemPress = jest.fn();
    const onPressItemOption = jest.fn();
    const onRefresh = jest.fn();

    act(() => {
      useNotificationStore.setState((state) => {
        state.tabAll.loading = true;
        return state;
      });
    });
    jest.useFakeTimers();

    const rendered = renderWithRedux(<NotificationList
      activeIndex
      type={notificationMenuData[0].type}
      keyValue={notificationMenuData[0].key}
      onPressItemOption={onPressItemOption}
      onItemPress={onItemPress}
      onRefresh={onRefresh}
    />);

    act(() => {
      jest.runAllTimers();
    });

    const loadingComponent = rendered.queryByTestId('notification_screen.loading');
    expect(loadingComponent).toBeDefined();
  });

  it('should render list notification if get notifications successfully ', () => {
    const onItemPress = jest.fn();
    const onPressItemOption = jest.fn();
    const onRefresh = jest.fn();

    const response = {
      code: 200,
      results: mockNotifications,
      unseen: 0,
    };
    const spy = jest.spyOn(notificationApi, 'getNotificationList').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    jest.useFakeTimers();

    const rendered = renderWithRedux(<NotificationList
      activeIndex
      type={notificationMenuData[0].type}
      keyValue={notificationMenuData[0].key}
      onPressItemOption={onPressItemOption}
      onItemPress={onItemPress}
      onRefresh={onRefresh}
    />);

    act(() => {
      jest.runAllTimers();
    });

    expect(spy).toBeCalled();

    const notiComponent = rendered.queryAllByTestId('notification_screen.item_wrapper');
    expect(notiComponent).toBeDefined();

    fireEvent.press(notiComponent[0]);
    expect(onItemPress).toHaveBeenCalled();

    const notiMenuComponent = rendered.queryAllByTestId('notification.menu_button');
    expect(notiMenuComponent).toBeDefined();

    fireEvent.press(notiMenuComponent[0]);
    expect(onPressItemOption).toHaveBeenCalled();
  });
});
