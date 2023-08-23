import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import useAdvancedNotiSettingsStore from '../AdvancedSettings/store';
import AdvancedSettingHeader from './AdvancedSettingHeader';

describe('Notification Advanced Setting Header Component', () => {
  const mockSelectedCommunity: any = {
    id: 'e41f5eb6-1697-4438-9230-2584ccbcdae8',
    name: 'Frontend-Web',
    icon: 'https://media.beincom.app/image/variants/group/avatar/022396d4-eeab-47aa-a1fb-f467e9b33005',
    level: 4,
    privacy: 'OPEN',
    createdAt: '2022-05-19T08:47:28.003Z',
    updatedAt: '2023-04-20T07:04:31.849Z',
    description: '',
  };

  it('should render correctly and call prop onPressToShowBottomSheet', () => {
    const onOpenGroupSearch = jest.fn();
    const onChangeToggle = jest.fn();
    const onOpenSearchCommunity = jest.fn();

    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingCommunitySettings = true;
      return state;
    });
    const wrapper = renderWithRedux(
      <AdvancedSettingHeader
        onPressSearch={onOpenGroupSearch}
        onChangeToggle={onChangeToggle}
        onPressToShowBottomSheet={onOpenSearchCommunity}
      />,
    );

    const selectedCommunity = wrapper.getByTestId('notification_advanced_setting_header.selected_community');
    expect(selectedCommunity).toBeDefined();
    fireEvent.press(selectedCommunity);

    expect(onOpenSearchCommunity).toBeCalled();
  });

  it('should render correctly and call prop onPressSearch', () => {
    const onOpenGroupSearch = jest.fn();
    const onChangeToggle = jest.fn();
    const onOpenSearchCommunity = jest.fn();

    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingCommunitySettings = false;
      state.selectedCommunity = mockSelectedCommunity;
      state.communityData = {
        [mockSelectedCommunity.id]: {
          enable: true,
        },
      } as any;
      return state;
    });
    const wrapper = renderWithRedux(
      <AdvancedSettingHeader
        onPressSearch={onOpenGroupSearch}
        onChangeToggle={onChangeToggle}
        onPressToShowBottomSheet={onOpenSearchCommunity}
      />,
    );

    const searchGroupComponent = wrapper.getByTestId('notification_advanced_setting_header.button_search_group');
    expect(searchGroupComponent).toBeDefined();
    fireEvent.press(searchGroupComponent);

    expect(onOpenGroupSearch).toBeCalled();
  });

  it('should render correctly and call prop onPressToShowBottomSheet', () => {
    const onOpenGroupSearch = jest.fn();
    const onChangeToggle = jest.fn();
    const onOpenSearchCommunity = jest.fn();

    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoadingCommunitySettings = false;
      state.selectedCommunity = mockSelectedCommunity;
      state.communityData = {
        [mockSelectedCommunity.id]: {
          enable: false,
        },
      } as any;
      return state;
    });

    const wrapper = renderWithRedux(
      <AdvancedSettingHeader
        onPressSearch={onOpenGroupSearch}
        onChangeToggle={onChangeToggle}
        onPressToShowBottomSheet={onOpenSearchCommunity}
      />,
    );

    const toggleComponent = wrapper.getByTestId('notification_settings.item.toggle');
    expect(toggleComponent).toBeDefined();
    fireEvent.press(toggleComponent);

    expect(onChangeToggle).toBeCalled();
  });
});
