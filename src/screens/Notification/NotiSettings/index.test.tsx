import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import NotificationSettings from './index';
import useNotiSettingsStore from './store';
import { INotiSettings } from '~/interfaces/INotification';
import { mockConfigData } from '~/test/mock_data/notificationConfig';
import * as navigationHook from '~/hooks/navigation';
import notiStack from '~/router/navigator/MainStack/stacks/notiStack/stack';

describe('Notification Setting Screen', () => {
  it('should render empty screen when can not get config', () => {
    useNotiSettingsStore.setState((state) => {
      state.data = {};
      state.loading = false;
      return state;
    });
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NotificationSettings />
        )}
      />,
    );

    const emptyComponent = wrapper.getByTestId('empty_screen');
    expect(emptyComponent).toBeDefined();
  });

  it('should render loading component when getting config', () => {
    useNotiSettingsStore.setState((state) => {
      state.data = {};
      state.loading = true;
      return state;
    });
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NotificationSettings />
        )}
      />,
    );

    const loadingComponent = wrapper.getByTestId('notification_settings.loading');
    expect(loadingComponent).toBeDefined();
  });

  it('should render correctly when get config success', () => {
    const mockConfigDataFormated = {};
    mockConfigData.forEach((item: INotiSettings) => {
      mockConfigDataFormated[item.name] = { ...item };
    });

    const updateSettings = jest.fn();

    useNotiSettingsStore.setState((state) => {
      state.data = mockConfigDataFormated;
      state.loading = false;
      state.actions.updateSettings = updateSettings;
      return state;
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NotificationSettings />
        )}
      />,
    );

    const itemComponents = wrapper.queryAllByTestId('notification_settings.item');
    expect(itemComponents.length).toEqual(mockConfigData.length);

    const toggleComponents = wrapper.queryAllByTestId('notification_settings.item.toggle');
    expect(toggleComponents.length).toBeGreaterThan(0);

    fireEvent.press(toggleComponents[0]);
    expect(updateSettings).toBeCalled();

    fireEvent.press(itemComponents[1]);
    expect(navigate).toBeCalledWith(notiStack.notiSettingDetail, { name: mockConfigData[1].name });
  });
});
