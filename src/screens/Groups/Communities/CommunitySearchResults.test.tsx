import React from 'react';

import { createTestStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import CommunitySearchResults from './CommunitySearchResults';
import { communityDetailData } from '~/test/mock_data/communities';
import initialState from '~/store/initialState';

describe('CommunitySearchResults component', () => {
  const onPressCommunity = jest.fn();

  it('should render data correctly', () => {
    const state = { ...initialState };
    state.groups.communitySearch = {
      loading: false,
      canLoadMore: true,
      ids: [communityDetailData.id],
      items: { [communityDetailData.id]: { ...communityDetailData } },
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <CommunitySearchResults onPressCommunity={onPressCommunity} />,
      store,
    );
    const flatlist = wrapper.getByTestId('flatlist');
    expect(flatlist).toBeDefined();
    const items = wrapper.getAllByTestId('community_item');
    expect(wrapper).toMatchSnapshot();
    expect(items.length).toBe(1);
    const loadingMore = wrapper.getByTestId(
      'community_search_results.loading_more',
    );
    expect(loadingMore).toBeDefined;
  });

  it('should NOT render empty screen correctly when loading', () => {
    const state = { ...initialState };
    state.groups.communitySearch.loading = true;
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <CommunitySearchResults onPressCommunity={onPressCommunity} />,
      store,
    );
    const emptyText = wrapper.queryByTestId(
      'community_search_results.no_results',
    );
    expect(emptyText).toBeNull();
  });

  it('should NOT render empty screen correctly when having data and NOT loading', () => {
    const state = { ...initialState };
    state.groups.communitySearch = {
      loading: false,
      canLoadMore: true,
      ids: [communityDetailData.id],
      items: { [communityDetailData.id]: { ...communityDetailData } },
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <CommunitySearchResults onPressCommunity={onPressCommunity} />,
      store,
    );
    const emptyText = wrapper.queryByTestId(
      'community_search_results.no_results',
    );
    expect(emptyText).toBeNull();
  });

  it('should render empty screen correctly when having NO data and NO loading', () => {
    const state = { ...initialState };
    state.groups.communitySearch = {
      loading: false,
      canLoadMore: false,
      ids: [],
      items: {},
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <CommunitySearchResults onPressCommunity={onPressCommunity} />,
      store,
    );
    const emptyText = wrapper.getByTestId(
      'community_search_results.no_results',
    );
    expect(emptyText).toBeDefined();
  });

  it('should render loading more indicator correctly', () => {
    const state = { ...initialState };
    state.groups.communitySearch = {
      loading: false,
      canLoadMore: true,
      ids: [communityDetailData.id],
      items: { [communityDetailData.id]: { ...communityDetailData } },
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <CommunitySearchResults onPressCommunity={onPressCommunity} />,
      store,
    );

    const loadingIndicator = wrapper.getByTestId(
      'community_search_results.loading_more',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should navigate to community profile correctly when pressing', () => {
    const state = { ...initialState };
    state.groups.communitySearch = {
      loading: false,
      canLoadMore: false,
      ids: [communityDetailData.id],
      items: { [communityDetailData.id]: { ...communityDetailData } },
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <CommunitySearchResults onPressCommunity={onPressCommunity} />,
      store,
    );
    const item = wrapper.getByTestId('community_item');
    fireEvent.press(item);
    expect(onPressCommunity).toBeCalled();
  });
});
