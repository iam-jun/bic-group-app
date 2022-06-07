import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import CommunityPendingMembers from '.';

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

  it('should NOT render list header correctly', () => {
    const state = {...initialState};
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<CommunityPendingMembers />, store);
    const textRequest = wrapper.queryByTestId('pending_members.request_title');
    expect(textRequest).toBeNull();
  });
});
