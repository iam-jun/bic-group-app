import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import CommunityPendingMembers from '.';
import {memberRequestDetail} from '~/test/mock_data/communities';

describe('CommunityPendingMembers', () => {
  it('should render empty screen when data is empty and loading = false', () => {
    const state = {...initialState};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<CommunityPendingMembers />, store);
    const emptyScreen = wrapper.getByTestId('empty_screen');
    expect(emptyScreen).toBeDefined();
  });

  it('should NOT render empty screen when loading = true', () => {
    const state = {...initialState};
    state.groups.communityMemberRequests = {
      total: 0,
      loading: true,
      canLoadMore: true,
      ids: [],
      items: {},
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<CommunityPendingMembers />, store);
    const emptyScreen = wrapper.queryByTestId('empty_screen');
    expect(emptyScreen).toBeNull();
  });

  it('should NOT render request title correctly', () => {
    const state = {...initialState};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<CommunityPendingMembers />, store);
    const textRequest = wrapper.queryByTestId(
      'community_pending_members.request_title',
    );
    expect(textRequest).toBeNull();
  });

  it('should render request title correctly', () => {
    const state = {...initialState};
    state.groups.communityMemberRequests = {
      total: 3,
      loading: false,
      canLoadMore: true,
      ids: [],
      items: {},
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<CommunityPendingMembers />, store);
    const textRequest = wrapper.getByTestId(
      'community_pending_members.request_title',
    );
    expect(textRequest.props.children).toBe('3 Requests');
  });

  it('should render loading more correctly', () => {
    const state = {...initialState};
    state.groups.communityMemberRequests = {
      total: 0,
      loading: false,
      canLoadMore: true,
      ids: [1],
      items: {1: {id: 1, user: {fullname: 'Testing Name'}}},
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<CommunityPendingMembers />, store);
    const loadingIndicator = wrapper.getByTestId(
      'community_pending_members.loading_more_indicator',
    );
    expect(loadingIndicator).toBeDefined();
  });

  it('should render data correctly', () => {
    const state = {...initialState};
    state.groups.communityMemberRequests = {
      total: 1,
      loading: false,
      canLoadMore: false,
      ids: [memberRequestDetail.id],
      items: {[memberRequestDetail.id]: {...memberRequestDetail}},
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<CommunityPendingMembers />, store);
    expect(wrapper).toMatchSnapshot();
  });
});
