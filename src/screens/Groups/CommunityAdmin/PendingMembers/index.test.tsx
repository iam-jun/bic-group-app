import React from 'react';

import {createTestStore, renderWithRedux} from '~/test/testUtils';
import initialState from '~/store/initialState';
import CommunityPendingMembers from '.';
import {memberRequestDetail} from '~/test/mock_data/communities';
import MockedNavigator from '~/test/MockedNavigator';
import {communityDetailData} from '~/test/mock_data/communities';


describe('CommunityPendingMembers', () => {
    const component = () => (
    <CommunityPendingMembers route={{params: {id: communityDetailData.id}}} />
  );
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
        const wrapper = renderWithRedux(
      <MockedNavigator component={component} />,
      store,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
