import React from 'react';

import { fireEvent, renderWithRedux } from '~/test/testUtils';
import MockedNavigator from '~/test/MockedNavigator';
import AdvancedSettings from './index';
import * as navigationHook from '~/hooks/navigation';
import notiStack from '~/router/navigator/MainStack/stacks/notiStack/stack';
import useAdvancedNotiSettingsStore from './store';
import useYourCommunitiesStore from '~/screens/communities/Communities/components/YourCommunities/store';
import { mockCommunityResponse, mockGroupInFlat } from '~/test/mock_data/advancedSettings';
import groupApi from '~/api/GroupApi';
import notificationApi from '~/api/NotificationApi';

describe('Notification Advanced Setting Screen', () => {
  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
  it('should render nothing to setup screen when list community is empty', () => {
    useYourCommunitiesStore.setState((state) => {
      state.ids = [];
      return state;
    });
    useAdvancedNotiSettingsStore.setState((state) => {
      state.joinedGroups = [];
      state.isLoading = false;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <AdvancedSettings />
        )}
      />,
    );

    const nothingSetupView = wrapper.queryByTestId('advanced_notifications_settings.nothing_setup');
    expect(nothingSetupView).toBeDefined();
  });

  it('should render loading component when getting config', () => {
    useAdvancedNotiSettingsStore.setState((state) => {
      state.joinedGroups = [];
      state.isLoading = false;
      return state;
    });
    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <AdvancedSettings />
        )}
      />,
    );

    const loadingComponent = wrapper.getByTestId('advanced_setting.loading');
    expect(loadingComponent).toBeDefined();
  });

  it('should render correctly when get config success', () => {
    const response = mockGroupInFlat;
    const spyApi = jest.spyOn(groupApi, 'getCommunityGroups').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const responseGetComSetting = mockCommunityResponse;
    const spyApiGetCommunitySetting = jest.spyOn(notificationApi, 'getCommunitySettings').mockImplementation(
      () => Promise.resolve(responseGetComSetting) as any,
    );

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
    useYourCommunitiesStore.setState((state) => {
      state.ids = ['e41f5eb6-1697-4438-9230-2584ccbcdae8'];
      state.items = {
        [mockSelectedCommunity.id]: mockSelectedCommunity,
      } as any;
      return state;
    });
    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoading = false;
      state.joinedGroups = mockGroupInFlat.data as any;
      state.selectedCommunity = mockSelectedCommunity;
      state.isLoadingCommunitySettings = false;
      state.communityData = {
        [mockSelectedCommunity.id]: {
          enable: true,
        },
      } as any;
      return state;
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <AdvancedSettings />
        )}
      />,
    );

    expect(spyApiGetCommunitySetting).toBeCalled();
    expect(spyApi).toBeCalled();

    const toggleComponent = wrapper.queryByTestId('notification_settings.item.toggle');
    expect(toggleComponent).toBeDefined();

    const groupItems = wrapper.queryAllByTestId('notification_advanced_setting_item');
    expect(groupItems.length).toEqual(mockGroupInFlat.data.length);
    fireEvent.press(groupItems[0]);
    const expectParams = {
      name: mockGroupInFlat.data[0].name,
      groupId: mockGroupInFlat.data[0].id,
      communityId: mockSelectedCommunity.id,
    };
    expect(navigate).toBeCalledWith(notiStack.advancedSettingsDetail, expectParams);
  });

  it('should render correctly when get config success', () => {
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
    useAdvancedNotiSettingsStore.setState((state) => {
      state.isLoading = false;
      state.joinedGroups = [];
      state.isLoadingJoinedGroup = false;
      state.selectedCommunity = mockSelectedCommunity;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <AdvancedSettings />
        )}
      />,
    );

    const groupEmptyView = wrapper.queryByTestId('empty_screen');
    expect(groupEmptyView).toBeDefined();
  });
});
