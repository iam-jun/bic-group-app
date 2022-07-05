import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import CommunityPendingMembers from '.';
import {memberRequestDetail} from '~/test/mock_data/communities';

describe('CommunityPendingMembers', () => {
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
