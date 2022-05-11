import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import DiscoverCommunities from '~/screens/Groups/Communities/DiscoverCommunities';
import {communityDetailData} from '~/test/mock_data/communities';

describe('DiscoverCommunities Screen', () => {
  it(`renders empty screen when list is empty and loading false`, async () => {
    const storeData: any = {
      ...initialState,
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: true,
          list: [],
        },
      },
    };
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<DiscoverCommunities />, store);
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).not.toBeNull();
  });

  it(`not renders empty screen with default state`, async () => {
    const storeData: any = {...initialState};
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<DiscoverCommunities />, store);
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).toBeNull();
  });

  it(`renders items with data`, async () => {
    const storeData: any = {
      ...initialState,
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: true,
          list: [communityDetailData],
        },
      },
    };
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<DiscoverCommunities />, store);
    const commItem = wrapper.queryByTestId(
      `community_${communityDetailData.id}`,
    );
    expect(commItem).not.toBeNull();
  });

  it(`renders discover header`, async () => {
    const storeData: any = {
      ...initialState,
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: true,
          list: [communityDetailData],
        },
      },
    };
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<DiscoverCommunities />, store);
    const header = wrapper.queryByTestId('discover_communities.header');
    expect(header).not.toBeNull();
  });

  it(`not renders discover header`, async () => {
    const storeData: any = {
      ...initialState,
      groups: {
        discoverCommunities: {
          loading: false,
          canLoadMore: true,
          list: [],
        },
      },
    };
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<DiscoverCommunities />, store);
    const header = wrapper.queryByTestId('discover_communities.header');
    expect(header).toBeNull();
  });
});
