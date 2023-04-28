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

    const spyApi = jest.spyOn(groupApi, 'getDiscoverGroups').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const newItems = mapItems(mockDiscoverGroupsResponse.data as any);

    const joinNewGroup = jest.fn();
    const cancelJoinGroup = jest.fn();

    useDiscoverGroupsStore.setState((state: IDiscoverGroupsState) => {
      state.ids = ['98484609-5673-4f9e-bdbd-790bcce88577', '1155635a-b16f-47e7-bad2-6cd41e9e8890', 'c74a74e6-9dfd-4fe1-9803-4ed2c4339da2'];
      state.items = newItems;
      state.actions.joinNewGroup = joinNewGroup;
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

    expect(spyApi).toBeCalled();

    const listGroupComp = wrapper.queryAllByTestId('discover_groups.items');
    expect(listGroupComp).toBeDefined();
    expect(listGroupComp.length).toEqual(mockDiscoverGroupsResponse.data.length);

    const btnJoin = wrapper.getAllByText(languages.common.btn_join);
    fireEvent.press(btnJoin[0]);
    expect(joinNewGroup).toBeCalled();

    const btnCancelRequest = wrapper.getAllByText(languages.common.btn_cancel_request);
    fireEvent.press(btnCancelRequest[0]);
    expect(cancelJoinGroup).toBeCalled();
  });
});
