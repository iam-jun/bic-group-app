import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import useNotiSettingsStore from './store';
import NotiSettingDetail from './NotiSettingDetail';
import { INotiSettings } from '~/interfaces/INotification';
import { mockConfigData } from '~/test/mock_data/notificationConfig';

describe('Notification Setting Screen', () => {
  const mockConfigDataFormated:{ [name: string]: INotiSettings } = {};
  mockConfigData.forEach((item: INotiSettings) => {
    mockConfigDataFormated[item.name] = { ...item };
  });

  it('should render correctly screen with config just has channels ', () => {
    useNotiSettingsStore.setState((state) => {
      state.data = mockConfigDataFormated;
      state.loading = false;
      return state;
    });
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NotiSettingDetail route={{
            params: { name: 'comment' },
          }}
          />
        )}
      />,
    );

    const titleComponent = wrapper.queryByTestId('header.text');
    expect(titleComponent).toBeDefined();
    expect(titleComponent?.props.children).toEqual(mockConfigDataFormated?.comment?.title);

    const subTitleComponent = wrapper.queryByTestId('notification_settings_detail.sub_title');
    expect(subTitleComponent).toBeDefined();
    expect(subTitleComponent?.props.children).toEqual(mockConfigDataFormated?.comment?.subtitle);
  });

  it('should render correctly screen with config just has child and channels inside', () => {
    const updateSettings = jest.fn();
    useNotiSettingsStore.setState((state) => {
      state.data = mockConfigDataFormated;
      state.loading = false;
      state.actions.updateSettings = updateSettings;
      return state;
    });
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NotiSettingDetail route={{
            params: { name: 'mentions' },
          }}
          />
        )}
      />,
    );

    const titleComponent = wrapper.queryByTestId('header.text');
    expect(titleComponent).toBeDefined();
    expect(titleComponent?.props.children).toEqual(mockConfigDataFormated?.mentions?.title);

    const subTitleComponent = wrapper.queryByTestId('notification_settings_detail.sub_title');
    expect(subTitleComponent).toBeDefined();
    expect(subTitleComponent?.props.children).toEqual(mockConfigDataFormated?.mentions?.subtitle);

    const childTitleComponents = wrapper.queryAllByTestId('notification_settings_detail.child.title');
    expect(childTitleComponents.length).toEqual(mockConfigDataFormated?.mentions?.child?.length);

    const childChannelComponents = wrapper.queryAllByTestId('notification_settings.item');
    // eslint-disable-next-line no-unsafe-optional-chaining
    expect(childChannelComponents.length).toEqual(mockConfigDataFormated?.mentions?.child?.length * 2 + 1);

    const notiSettingToggleItems = wrapper.queryAllByTestId('notification_settings.item.toggle');
    expect(notiSettingToggleItems.length).toBeGreaterThan(2);
    fireEvent.press(notiSettingToggleItems[0]);
    expect(updateSettings).toBeCalled();

    fireEvent.press(notiSettingToggleItems[1]);
    expect(updateSettings).toBeCalled();
  });

  it('should render correctly screen with config just has child and NO channels inside', () => {
    const updateSettings = jest.fn();
    useNotiSettingsStore.setState((state) => {
      state.data = mockConfigDataFormated;
      state.loading = false;
      state.actions.updateSettings = updateSettings;
      return state;
    });
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <NotiSettingDetail route={{
            params: { name: 'email' },
          }}
          />
        )}
      />,
    );

    const titleComponent = wrapper.queryByTestId('header.text');
    expect(titleComponent).toBeDefined();
    expect(titleComponent?.props.children).toEqual(mockConfigDataFormated?.email?.title);

    const subTitleComponent = wrapper.queryByTestId('notification_settings_detail.sub_title');
    expect(subTitleComponent).toBeDefined();
    expect(subTitleComponent?.props.children).toEqual(mockConfigDataFormated?.email?.subtitle);

    const childTitleComponents = wrapper.queryAllByTestId('notification_settings_detail.child.title');
    expect(childTitleComponents.length).toEqual(0);

    const childChannelComponents = wrapper.queryAllByTestId('notification_settings.item');
    // eslint-disable-next-line no-unsafe-optional-chaining
    expect(childChannelComponents.length).toEqual(mockConfigDataFormated?.email?.child?.length + 1);

    const notiSettingToggleItems = wrapper.queryAllByTestId('notification_settings.item.toggle');
    // eslint-disable-next-line no-unsafe-optional-chaining
    expect(notiSettingToggleItems.length).toEqual(mockConfigDataFormated?.email?.child?.length + 1);
    fireEvent.press(notiSettingToggleItems[0]);
    expect(updateSettings).toBeCalled();

    fireEvent.press(notiSettingToggleItems[1]);
    expect(updateSettings).toBeCalled();
  });
});
