import React from 'react';

import {renderWithRedux, createTestStore} from '~/test/testUtils';
import SearchResultContent from './SearchResultContent';
import initialState from '~/store/initialState';
import {adminDetail, memberDetail} from '~/test/mock_data/group';

describe('SearchResultContent component', () => {
  const onPressMenu = jest.fn();

  it('should NOT render empty screen correctly when loading', () => {
    const state = {...initialState};
    state.groups.groupSearchMembers.loading = true;
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <SearchResultContent onPressMenu={onPressMenu} />,
      store,
    );
    const emptyText = wrapper.queryByTestId('search_result_content.no_results');
    expect(emptyText).toBeNull();
  });

  it('should NOT render empty screen correctly when having data and NOT loading', () => {
    const state = {...initialState};
    state.groups.groupSearchMembers = {
      loading: false,
      canLoadMore: true,
      data: [adminDetail, memberDetail],
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <SearchResultContent onPressMenu={onPressMenu} />,
      store,
    );
    const emptyScreen = wrapper.queryByTestId(
      'search_result_content.no_results',
    );
    expect(emptyScreen).toBeNull();
  });

  it('should render empty screen correctly when having NO data and NO loading', () => {
    const state = {...initialState};
    state.groups.groupSearchMembers = {
      loading: false,
      data: [],
      canLoadMore: false,
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <SearchResultContent onPressMenu={onPressMenu} />,
      store,
    );
    const emptyScreen = wrapper.getByTestId('search_result_content.no_results');
    expect(emptyScreen).toBeDefined();
  });

  it('should render loading more indicator correctly', () => {
    const state = {...initialState};
    state.groups.groupSearchMembers = {
      loading: false,
      data: [adminDetail, memberDetail],
      canLoadMore: true,
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <SearchResultContent onPressMenu={onPressMenu} />,
      store,
    );
    const loadingIndicator = wrapper.getByTestId(
      'search_result_content.loading_more',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should NOT render loading more indicator correctly', () => {
    const state = {...initialState};
    state.groups.groupSearchMembers = {
      loading: true,
      data: [],
      canLoadMore: true,
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <SearchResultContent onPressMenu={onPressMenu} />,
      store,
    );
    const loadingIndicator = wrapper.queryByTestId(
      'search_result_content.loading_more',
    );
    expect(loadingIndicator).toBeNull();
  });

  it('should render data correctly', () => {
    const state = {...initialState};
    state.groups.groupSearchMembers = {
      loading: false,
      data: [adminDetail, memberDetail],
      canLoadMore: false,
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <SearchResultContent onPressMenu={onPressMenu} />,
      store,
    );
    const flatlist = wrapper.getByTestId('flatlist');
    expect(flatlist).toBeDefined();
    const items = wrapper.getAllByTestId('search_result_content.item');
    expect(wrapper).toMatchSnapshot();
    expect(items.length).toBe(2);
  });
});
