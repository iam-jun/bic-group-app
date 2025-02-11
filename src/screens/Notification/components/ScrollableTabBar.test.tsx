import React from 'react';
import { act, fireEvent, renderWithRedux } from '../../../test/testUtils';
import ScrollableTabBar from './ScrollableTabBar';
import { notificationMenuData } from '../constants';
import { mockNotifications } from '~/test/mock_data/notifications';
import notificationApi from '~/api/NotificationApi';

describe('ScrollableTabBar component', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
  it('should render empty screen if get notifications successfully with no data', () => {
    const onItemPress = jest.fn();
    const onPressItemOption = jest.fn();
    const onPressFilterItem = jest.fn();
    const onRefresh = jest.fn();

    const rendered = renderWithRedux(<ScrollableTabBar
      activeIndex={0}
      data={notificationMenuData}
      onItemPress={onItemPress}
      onPressItemOption={onPressItemOption}
      onChangeTab={onPressFilterItem}
      onRefresh={onRefresh}
    />);

    const filterComponent = rendered.queryByTestId('notification.filter');
    expect(filterComponent).toBeDefined();

    notificationMenuData.forEach((item) => {
      const itemComp = rendered.getByTestId(`notification.filter.item_${item?.text}`);
      expect(itemComp).toBeDefined();
    });

    const scrollViewContainerComponent = rendered.queryByTestId('notification.list_container');
    expect(scrollViewContainerComponent).toBeDefined();
  });

  it('should render list notification if get notifications successfully ', () => {
    const onItemPress = jest.fn();
    const onPressItemOption = jest.fn();
    const onPressFilterItem = jest.fn();
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

    const rendered = renderWithRedux(<ScrollableTabBar
      activeIndex={0}
      data={notificationMenuData}
      onItemPress={onItemPress}
      onPressItemOption={onPressItemOption}
      onChangeTab={onPressFilterItem}
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

  it('should call onChangeTab when press to filter item', () => {
    const onItemPress = jest.fn();
    const onPressItemOption = jest.fn();
    const onPressFilterItem = jest.fn();
    const onRefresh = jest.fn();

    const rendered = renderWithRedux(<ScrollableTabBar
      activeIndex={0}
      data={notificationMenuData}
      onItemPress={onItemPress}
      onPressItemOption={onPressItemOption}
      onChangeTab={onPressFilterItem}
      onRefresh={onRefresh}
    />);

    const filterComponent = rendered.queryByTestId('notification.filter');
    expect(filterComponent).toBeDefined();

    const filterItemsComp = [];
    notificationMenuData.forEach((item) => {
      const itemComp = rendered.getByTestId(`notification.filter.item_${item?.text}`);
      expect(itemComp).toBeDefined();

      filterItemsComp.push(itemComp);
    });

    fireEvent.press(filterItemsComp[1]);
    expect(onPressFilterItem).toHaveBeenCalled();
  });
});
