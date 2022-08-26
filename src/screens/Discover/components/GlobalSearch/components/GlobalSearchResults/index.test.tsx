import React from 'react';
import { createTestStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import GlobalSearchResults from '.';
import { communityDetailData } from '~/test/mock_data/communities';
import initialState from '~/storeRedux/initialState';

describe('GlobalSearchResults component', () => {
  const onView = jest.fn();
  const onJoin = jest.fn();
  const onCancel = jest.fn();

  const baseProps = {
    onView,
    onJoin,
    onCancel,
  };

  it('should render data correctly', () => {
    const state = { ...initialState };
    state.groups.globalSearch = {
      loading: false,
      canLoadMore: true,
      ids: [communityDetailData.id],
      items: { [communityDetailData.id]: { ...communityDetailData } },
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <GlobalSearchResults {...baseProps} />,
      store,
    );
    const flatlist = wrapper.getByTestId('global_search_results.flatlist');
    expect(flatlist).toBeDefined();
    const items = wrapper.getAllByTestId('global_search_results.item');
    expect(wrapper).toMatchSnapshot();
    expect(items.length).toBe(1);
    const loadingMore = wrapper.getByTestId(
      'global_search_results.loading_more',
    );
    expect(loadingMore).toBeDefined();
  });

  it('should NOT render empty screen correctly when loading', () => {
    const state = { ...initialState };
    state.groups.communitySearch.loading = true;
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <GlobalSearchResults {...baseProps} />,
      store,
    );
    const emptyText = wrapper.queryByTestId(
      'global_search_results.no_results',
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
      <GlobalSearchResults {...baseProps} />,
      store,
    );
    const emptyText = wrapper.queryByTestId(
      'global_search_results.no_results',
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
      <GlobalSearchResults {...baseProps} />,
      store,
    );
    const emptyText = wrapper.getByTestId(
      'global_search_results.no_results',
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
      <GlobalSearchResults {...baseProps} />,
      store,
    );

    const loadingIndicator = wrapper.getByTestId(
      'global_search_results.loading_more',
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
      <GlobalSearchResults {...baseProps} />,
      store,
    );
    const item = wrapper.getByTestId('global_search_results_item_0');
    fireEvent.press(item);
    expect(onView).toBeCalled();
  });
});
