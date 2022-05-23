import React from 'react';

import {renderWithRedux, createTestStore} from '~/test/testUtils';
import ManagedCommunities from './ManagedCommunities';
import initialState from '~/store/initialState';
import {communityDetailData} from '~/test/mock_data/communities';

describe('ManagedCommunities component', () => {
  it('should NOT render empty screen correctly when loading', () => {
    const state = {...initialState};
    state.groups.managedCommunities.loading = true;
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<ManagedCommunities />, store);
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).toBeNull();
  });

  it('should NOT render empty screen correctly when having data and not loading', () => {
    const state = {...initialState};
    state.groups.managedCommunities = {
      loading: false,
      data: [communityDetailData.id],
      items: {[communityDetailData.id]: communityDetailData},
      canLoadMore: true,
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(<ManagedCommunities />, store);
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).toBeNull();
  });

  it('should render empty screen correctly when having NO data and not loading', () => {
    const state = {...initialState};
    state.groups.managedCommunities = {
      loading: false,
      data: [],
      items: {},
      canLoadMore: true,
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(<ManagedCommunities />, store);
    const emptyScreen = wrapper.getByTestId('empty_screen');
    expect(emptyScreen).toBeDefined();
  });

  it('should render loading more indicator correctly', () => {
    const state = {...initialState};
    state.groups.managedCommunities = {
      loading: false,
      data: [communityDetailData.id],
      items: {[communityDetailData.id]: communityDetailData},
      canLoadMore: true,
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<ManagedCommunities />, store);
    const loadingIndicator = wrapper.getByTestId(
      'managed_communites.loading_more',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should NOT render loading more indicator correctly', () => {
    const state = {...initialState};
    state.groups.managedCommunities = {
      loading: true,
      data: [],
      items: {},
      canLoadMore: true,
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<ManagedCommunities />, store);
    const loadingIndicator = wrapper.queryByTestId(
      'managed_communites.loading_more',
    );
    expect(loadingIndicator).toBeNull();
  });

  it('should render data correctly', () => {
    const state = {...initialState};
    state.groups.managedCommunities = {
      loading: false,
      data: [communityDetailData.id],
      items: {[communityDetailData.id]: communityDetailData},
      canLoadMore: false,
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(<ManagedCommunities />, store);
    const flatlist = wrapper.getByTestId('flatlist');
    expect(flatlist).toBeDefined();
    const items = wrapper.getAllByTestId('community_item');
    expect(wrapper).toMatchSnapshot();
    expect(items.length).toBe(1);
  });
});
