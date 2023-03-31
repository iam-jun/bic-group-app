import React from 'react';
import { fireEvent, languages, renderWithRedux } from '~/test/testUtils';
import DiscoverCommunities from './index';
import useDiscoverCommunitiesStore, { IDiscoverCommunitiesState } from './store';
import * as navigationHook from '~/hooks/navigation';
import useCommunityController from '~/screens/communities/store';
import useCommunitiesStore from '~/store/entities/communities';
import { mockDiscoverCommunityResponse } from '~/test/mock_data/discoverCommunity';

describe('DiscoverCommunities component', () => {
  const mockData = mockDiscoverCommunityResponse.data;
  it('should render empty screen if loading = false and hasNextPage = []', () => {
    useDiscoverCommunitiesStore.setState((state: IDiscoverCommunitiesState) => {
      state.loading = false;
      return state;
    });

    const wrapper = renderWithRedux(
      <DiscoverCommunities />,
    );
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).toBeDefined();
  });

  it('should render empty screen if loading = false and ids = []', () => {
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const ids = [mockData[0].id, mockData[1].id, mockData[2].id,
    ];
    useDiscoverCommunitiesStore.setState((state: IDiscoverCommunitiesState) => {
      state.ids = ids;
      state.loading = false;
      state.hasNextPage = true;
      return state;
    });

    const joinCommunity = jest.fn();
    const cancelJoinCommunity = jest.fn();
    useCommunityController.setState((state) => {
      state.actions.joinCommunity = joinCommunity;
      state.actions.cancelJoinCommunity = cancelJoinCommunity;
      return state;
    });

    const newItems = mockData.reduce(
      (accumulator, currentItem) => ({
        ...accumulator,
        [currentItem.id]: currentItem,
      }),
      {},
    );
    useCommunitiesStore.setState((state) => {
      state.data = newItems;
      return state;
    });

    const wrapper = renderWithRedux(
      <DiscoverCommunities />,
    );
    const discoverItemComp = wrapper.queryAllByTestId('discover_communities_item');
    expect(discoverItemComp.length).toEqual(mockData.length);

    const btnJoin = wrapper.getByText(languages.common.btn_join);
    fireEvent.press(btnJoin);
    expect(joinCommunity).toBeCalled();

    const btnView = wrapper.getByText(languages.common.btn_view);
    fireEvent.press(btnView);
    expect(navigate).toBeCalled();

    const btnCancelRequest = wrapper.getByText(languages.common.btn_cancel_request);
    fireEvent.press(btnCancelRequest);
    expect(cancelJoinCommunity).toBeCalled();
  });
});
