import React from 'react';

import { createTestStore, renderWithRedux } from '../../../../test/testUtils';
import initialState from '../../../../storeRedux/initialState';
import CommunityPendingMembers from './index';
import { memberRequestDetail, communityDetailData } from '../../../../test/mock_data/communities';
import MockedNavigator from '../../../../test/MockedNavigator';

describe('CommunityPendingMembers', () => {
  const component = () => (
    <CommunityPendingMembers route={{ params: { id: communityDetailData.id } }} />
  );
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
      <MockedNavigator component={component} />,
      store,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
