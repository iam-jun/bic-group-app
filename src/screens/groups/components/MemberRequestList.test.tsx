import React from 'react';

import { createTestStore, renderWithRedux } from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';
import MemberRequestList from './MemberRequestList';
import { memberRequestDetail, communityDetailData } from '~/test/mock_data/communities';

describe('MemberRequestList', () => {
  const onLoadMore = jest.fn();
  const onRefresh = jest.fn();

  it('should render empty screen when data is empty and loading = false', () => {
    const state = { ...initialState };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberRequestList
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
      />,
      store,
    );
    const emptyScreen = wrapper.getByTestId('empty_screen');
    expect(emptyScreen).toBeDefined();
  });

  it('should NOT render empty screen when loading = true', () => {
    const state = { ...initialState };
    state.groups.communityMemberRequests = {
      total: 0,
      loading: true,
      canLoadMore: true,
      ids: [],
      items: {},
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberRequestList
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
      />,
      store,
    );
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).toBeNull();
  });

  it('should NOT render request title correctly when there is no data', () => {
    const state = { ...initialState };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberRequestList
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
      />,
      store,
    );
    const textRequest = wrapper.queryByTestId(
      'member_request_list.request_title',
    );
    expect(textRequest).toBeNull();
  });

  it('should render request title correctly', () => {
    const state = { ...initialState };
    state.groups.communityMemberRequests = {
      total: 3,
      loading: false,
      canLoadMore: true,
      ids: [],
      items: {},
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberRequestList
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
      />,
      store,
    );
    const textRequest = wrapper.getByTestId(
      'member_request_list.request_title',
    );
    expect(textRequest.props.children).toBe('3 Requests');
  });

  it('should render loading more correctly', () => {
    const state = { ...initialState };
    state.groups.communityMemberRequests = {
      total: 1,
      loading: false,
      canLoadMore: true,
      ids: ['1'],
      items: {
        1: memberRequestDetail,
      },
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberRequestList
        id={communityDetailData.id}
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
      />,
      store,
    );
    const loadingIndicator = wrapper.getByTestId(
      'member_request_list.loading_more_indicator',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should render data correctly', () => {
    const state = { ...initialState };
    state.groups.communityMemberRequests = {
      total: 1,
      loading: false,
      canLoadMore: false,
      ids: [memberRequestDetail.id],
      items: { [memberRequestDetail.id]: { ...memberRequestDetail } },
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberRequestList
        id={communityDetailData.id}
        type="community"
        onLoadMore={onLoadMore}
        onRefresh={onRefresh}
      />,
      store,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
