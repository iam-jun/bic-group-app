import React from 'react';
import initialState from '../../../storeRedux/initialState';
import { configureStore, renderWithRedux } from '../../../test/testUtils';
import YourGroups from './YourGroups';
import { listYourGroups } from '../../../test/mock_data/communities';

describe('YourGroups Screen', () => {
  it('given an empty list, should render empty component', () => {
    const mockStore = configureStore([]);
    const storeData = {
      ...initialState,
      groups: {
        ...initialState.groups,
        joinedAllGroups: {
          ...initialState.groups.joinedAllGroups,
          canLoadMore: false,
        },
      },
    };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<YourGroups />, store);
    const emptyComp = wrapper.queryByTestId('empty_screen');
    expect(emptyComp).not.toBeNull();
  });

  it('given n items, Flatlist should render n items', () => {
    const mockStore = configureStore([]);
    const storeData = {
      ...initialState,
      groups: {
        joinedAllGroups: {
          isRefresh: false,
          isLoading: false,
          canLoadMore: true,
          ids: [...listYourGroups.map((item) => item.id)],
          items: listYourGroups.reduce((accumulator, currentItem) => ({
            ...accumulator,
            [currentItem.id]: currentItem,
          }), {}),
        },
      },
    };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<YourGroups />, store);
    const items = wrapper.queryAllByTestId(/your_groups_item_/);
    expect(items.length).toBe(listYourGroups.length);
  });
});
