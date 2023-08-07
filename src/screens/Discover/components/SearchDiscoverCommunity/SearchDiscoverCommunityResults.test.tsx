import React from 'react';
import { fireEvent, languages, renderWithRedux } from '~/test/testUtils';
import SearchDiscoverCommunityResults from './SearchDiscoverCommunityResults';
import { mockDiscoverCommunityResponse } from '~/test/mock_data/discoverCommunity';
import useDiscoverCommunitiesSearchStore, { IDiscoverCommunitiesSearchState } from './store';
import useCommunityController from '~/screens/communities/store';
import useCommunitiesStore from '~/store/entities/communities';
import * as helper from '~/router/helper';

describe('SearchDiscoverCommunityResults component', () => {
  const mockData = mockDiscoverCommunityResponse.data;
  it('should render empty screen if loading = false and ids = []', () => {
    useDiscoverCommunitiesSearchStore.setState((state: IDiscoverCommunitiesSearchState) => {
      state.loading = false;
      return state;
    });

    const onLoadMore = jest.fn();

    const wrapper = renderWithRedux(
      <SearchDiscoverCommunityResults
        onLoadMore={onLoadMore}
      />,
    );
    const emptyText = wrapper.queryByTestId('community_search_results.no_results');
    expect(emptyText.children[0]).toEqual(languages.common.text_search_no_results);
  });

  it('should render empty screen if loading = false and ids = []', () => {
    const onLoadMore = jest.fn();
    const navigateToCommunityDetail = jest.spyOn(helper, 'navigateToCommunityDetail');

    const ids = [mockData[0].id, mockData[1].id, mockData[2].id,
    ];
    useDiscoverCommunitiesSearchStore.setState((state: IDiscoverCommunitiesSearchState) => {
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
      <SearchDiscoverCommunityResults
        onLoadMore={onLoadMore}
      />,
    );
    const discoverItemComp = wrapper.queryAllByTestId('global_search_results.item');
    expect(discoverItemComp.length).toEqual(mockData.length);

    const btnJoin = wrapper.getByText(languages.common.btn_join);
    fireEvent.press(btnJoin);
    expect(joinCommunity).toBeCalled();

    const btnView = wrapper.getByText(languages.common.btn_view);
    fireEvent.press(btnView);
    expect(navigateToCommunityDetail).toBeCalled();

    const btnCancelRequest = wrapper.getByText(languages.common.btn_cancel_request);
    fireEvent.press(btnCancelRequest);
    expect(cancelJoinCommunity).toBeCalled();
  });
});
