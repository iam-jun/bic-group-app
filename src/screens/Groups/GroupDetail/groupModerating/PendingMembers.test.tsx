import React from 'react';

import { createTestStore, renderWithRedux } from '~/test/testUtils';
import initialState from '~/store/initialState';
import GroupPendingMembers from './PendingMembers';
import { memberRequestDetail } from '~/test/mock_data/communities';

describe('GroupPendingMembers', () => {
  it('should render data correctly', () => {
    const state = { ...initialState };
    state.groups.groupMemberRequests = {
      total: 1,
      loading: false,
      canLoadMore: false,
      ids: [memberRequestDetail.id],
      items: { [memberRequestDetail.id]: { ...memberRequestDetail } },
    };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(<GroupPendingMembers />, store);
    expect(wrapper).toMatchSnapshot();
  });
});
