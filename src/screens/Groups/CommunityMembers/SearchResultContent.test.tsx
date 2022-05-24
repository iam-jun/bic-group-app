import React from 'react';

import {renderWithRedux, createTestStore} from '~/test/testUtils';
import SearchResultContent from './SearchResultContent';
import initialState from '~/store/initialState';
import {adminDetail, memberDetail} from '~/test/mock_data/communities';

describe('SearchResultContent component', () => {
  it('should NOT render empty screen correctly when loading', () => {
    const state = {...initialState};
    state.groups.communitySearchMembers.loading = true;
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<SearchResultContent />, store);
    const emptyText = wrapper.queryByTestId('search_result_content.no_results');
    expect(emptyText).toBeNull();
  });

  it('should NOT render empty screen correctly when having data and NOT loading', () => {
    const state = {...initialState};
    state.groups.communitySearchMembers = {
      loading: false,
      canLoadMore: true,
      data: [adminDetail, memberDetail],
    };
    // @ts-ignore
    state.auth.user = {username: 'testname1'};

    const store = createTestStore(state);
    const wrapper = renderWithRedux(<SearchResultContent />, store);
    const emptyScreen = wrapper.queryByTestId(
      'search_result_content.no_results',
    );
    expect(emptyScreen).toBeNull();
  });

  it('should render empty screen correctly when having NO data and NO loading', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname1'};
    state.groups.communitySearchMembers = {
      loading: false,
      data: [],
      canLoadMore: true,
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(<SearchResultContent />, store);
    const emptyScreen = wrapper.getByTestId('search_result_content.no_results');
    expect(emptyScreen).toBeDefined();
  });

  it('should render loading more indicator correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname1'};
    state.groups.communitySearchMembers = {
      loading: false,
      data: [adminDetail, memberDetail],
      canLoadMore: true,
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<SearchResultContent />, store);
    const loadingIndicator = wrapper.getByTestId(
      'search_result_content.loading_more',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should NOT render loading more indicator correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname1'};
    state.groups.communitySearchMembers = {
      loading: true,
      data: [],
      canLoadMore: true,
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<SearchResultContent />, store);
    const loadingIndicator = wrapper.queryByTestId(
      'search_result_content.loading_more',
    );
    expect(loadingIndicator).toBeNull();
  });

  it('should render data correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname1'};
    state.groups.communitySearchMembers = {
      loading: false,
      data: [adminDetail, memberDetail],
      canLoadMore: false,
    };

    const store = createTestStore(state);
    const wrapper = renderWithRedux(<SearchResultContent />, store);
    const flatlist = wrapper.getByTestId('flatlist');
    expect(flatlist).toBeDefined();
    const items = wrapper.getAllByTestId('member_item');
    expect(wrapper).toMatchSnapshot();
    expect(items.length).toBe(2);
  });
});
