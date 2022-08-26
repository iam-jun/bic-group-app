import React from 'react';
import initialState from '~/storeRedux/initialState';
import { configureStore, renderWithRedux } from '~/test/testUtils';
import { listDiscoverCommunities } from '~/test/mock_data/communities';
import DiscoverCommunities from '.';

describe('DiscoverCommunities Screen', () => {
  it('given an empty list & canLoadMore = false, should render empty component', () => {
    const mockStore = configureStore([]);
    const storeData = {
      ...initialState,
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: false,
          ids: [],
          items: {},
        },
      },
    };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<DiscoverCommunities />, store);
    const emptyComp = wrapper.queryByTestId('empty_screen');
    expect(emptyComp).not.toBeNull();
  });

  it('should not render empty component with default state', () => {
    const mockStore = configureStore([]);
    const storeData = { ...initialState };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<DiscoverCommunities />, store);
    const emptyComp = wrapper.queryByTestId('empty_screen');
    expect(emptyComp).toBeNull();
  });

  it('given n items, Flatlist should render n items', () => {
    const mockStore = configureStore([]);
    const storeData = {
      ...initialState,
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: true,
          ids: [...listDiscoverCommunities.map((item) => item.id)],
          items: listDiscoverCommunities.reduce((accumulator, currentItem) => ({
            ...accumulator,
            [currentItem.id]: currentItem,
          }), {}),
        },
      },
    };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<DiscoverCommunities />, store);
    const items = wrapper.queryAllByTestId(/discover_communities_item_/);
    expect(items.length).toBe(listDiscoverCommunities.length);
  });
});
