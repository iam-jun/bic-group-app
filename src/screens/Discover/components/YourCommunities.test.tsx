import React from 'react';
import initialState from '../../../storeRedux/initialState';
import { configureStore, renderWithRedux } from '../../../test/testUtils';
import YourCommunities from './YourCommunities';
import { listYourCommunities } from '../../../test/mock_data/communities';

describe('YourCommunities Screen', () => {
  it('given an empty list, should render empty component', () => {
    const mockStore = configureStore([]);
    const storeData = {
      ...initialState,
    };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<YourCommunities />, store);
    const emptyComp = wrapper.queryByTestId('empty_screen');
    expect(emptyComp).not.toBeNull();
  })

  it('given n items, Flatlist should render n items', () => {
    const mockStore = configureStore([]);
    const storeData = {
      ...initialState,
      groups: {
        joinedCommunities: {
          loading: false,
          data: [...listYourCommunities],
        },
      },
    };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<YourCommunities />, store);
    const items = wrapper.queryAllByTestId(/your_communities_item_/);
    expect(items.length).toBe(listYourCommunities.length);
  });
})
