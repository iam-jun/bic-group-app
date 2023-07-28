/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';

import {
  fireEvent,
  languages,
  renderWithRedux,
} from '~/test/testUtils';

import MockedNavigator from '~/test/MockedNavigator';
import DiscoverGroups from './index';
import useDiscoverGroupsStore from './store';
import IDiscoverGroupsState from './store/Interface';
import { mockDiscoverGroupsResponse } from '~/test/mock_data/discoverGroup';
import groupApi from '~/api/GroupApi';
import { mapItems } from '../helper/mapper';
import { getPreviewJoinableGroupResponse } from '~/test/mock_data/group';

describe('Discover Groups screen', () => {
  it('should render empty screen if loading = false and ids is empty', () => {
    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.loading = false;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <DiscoverGroups
            route={{ params: { communityId: 'test' } }}
          />
        )}
      />,
    );

    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).toBeDefined();
  });

  it('should render loading screen if loading = true and ids is empty', () => {
    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.loading = true;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <DiscoverGroups
            route={{ params: { communityId: 'test' } }}
          />
        )}
      />,
    );

    const loadingScreen = wrapper.queryByTestId('discover_groups.loading');
    expect(loadingScreen).toBeDefined();
  });

  it('should render list group discover', () => {
    const communityId = '656cebfe-1b91-473f-97fd-96837bf9e2a5';
    const response = mockDiscoverGroupsResponse;

    const getDiscoverGroupsApi = jest.spyOn(groupApi, 'getDiscoverGroups').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const getPreviewJoinableGroupApi = jest.spyOn(groupApi, 'getPreviewJoinableGroup').mockImplementation(
      () => Promise.resolve(getPreviewJoinableGroupResponse) as any,
    );

    const newItems = mapItems(mockDiscoverGroupsResponse.data as any);

    const cancelJoinGroup = jest.fn();

    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.ids = [
        mockDiscoverGroupsResponse.data[0].id,
        mockDiscoverGroupsResponse.data[1].id,
        mockDiscoverGroupsResponse.data[2].id,
      ];
      state.items = newItems;
      state.actions.cancelJoinGroup = cancelJoinGroup;
      return state;
    });

    const wrapper = renderWithRedux(
      <MockedNavigator
        component={() => (
          <DiscoverGroups
            route={{ params: { communityId } }}
          />
        )}
      />,
    );

    expect(getDiscoverGroupsApi).toBeCalled();

    const listGroupComp = wrapper.queryAllByTestId('discover_groups.items');
    expect(listGroupComp).toBeDefined();
    expect(listGroupComp.length).toEqual(mockDiscoverGroupsResponse.data.length);

    const btnJoin = wrapper.getAllByText(languages.common.btn_join);
    fireEvent.press(btnJoin[0]);
    expect(getPreviewJoinableGroupApi).toBeCalled();

    const btnCancelRequest = wrapper.getAllByText(languages.common.btn_cancel_request);
    fireEvent.press(btnCancelRequest[0]);
    expect(cancelJoinGroup).toBeCalled();
  });
});
