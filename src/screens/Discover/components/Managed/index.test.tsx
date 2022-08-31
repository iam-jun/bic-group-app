import React from 'react';
import initialState from '~/storeRedux/initialState';
import { configureStore, renderWithRedux } from '~/test/testUtils';
import { listOwnCommunity, listManage } from '~/test/mock_data/communities';
import Managed from '.';

describe('Managed Screen', () => {
  it('given an empty list owner, should render empty component', () => {
    const mockData = {
      isRefresh: false,
      owner: {
        canLoadMore: false,
        ids: [],
        items: {},
      },
      manage: {
        isLoading: false,
        canLoadMore: true,
        ids: [],
        items: {},
      },
    };
    const mockStore = configureStore([]);
    const storeData = {
      ...initialState,
      groups: {
        ...initialState.groups,
        managed: mockData,
      },
    };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<Managed />, store);
    const emptyComp = wrapper.queryByTestId('list_empty_owner');
    expect(emptyComp).not.toBeNull();
  });

  it('given n items in list owner, Flatlist should render n items', () => {
    const mockData = {
      isRefresh: false,
      owner: {
        canLoadMore: false,
        ids: [...listOwnCommunity.map((item) => item.id)],
        items: listOwnCommunity.reduce((accumulator, currentItem) => ({
          ...accumulator,
          [currentItem.id]: currentItem,
        }), {}),
      },
      manage: {
        isLoading: false,
        canLoadMore: true,
        ids: [],
        items: {},
      },
    };
    const mockStore = configureStore([]);
    const storeData = {
      ...initialState,
      groups: {
        ...initialState.groups,
        managed: mockData,
      },
    };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<Managed />, store);
    const items = wrapper.queryAllByTestId(/managed_owner_item_/);
    expect(items.length).toBe(listOwnCommunity.length);
  });

  it('given an empty list manage, should render empty component', () => {
    const mockData = {
      isRefresh: false,
      owner: {
        canLoadMore: true,
        ids: [],
        items: {},
      },
      manage: {
        isLoading: false,
        canLoadMore: false,
        ids: [],
        items: {},
      },
    };
    const mockStore = configureStore([]);
    const storeData = {
      ...initialState,
      groups: {
        ...initialState.groups,
        managed: mockData,
      },
    };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<Managed />, store);
    const emptyComp = wrapper.queryByTestId('list_empty_manage');
    expect(emptyComp).not.toBeNull();
  });

  it('given n items in list manage, Flatlist should render n items', () => {
    const mockData = {
      isRefresh: false,
      owner: {
        canLoadMore: true,
        ids: [],
        items: {},
      },
      manage: {
        isLoading: false,
        canLoadMore: true,
        ids: [...listManage.map((item) => item.id)],
        items: listManage.reduce((accumulator, currentItem) => ({
          ...accumulator,
          [currentItem.id]: currentItem,
        }), {}),
      },
    };
    const mockStore = configureStore([]);
    const storeData = {
      ...initialState,
      groups: {
        ...initialState.groups,
        managed: mockData,
      },
    };
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(<Managed />, store);
    const items = wrapper.queryAllByTestId(/managed_manage_item_/);
    expect(items.length).toBe(listManage.length);
  });
});
