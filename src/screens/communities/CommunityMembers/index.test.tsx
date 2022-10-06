import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import CommunityMembers from './index';
import MockedNavigator from '../../../test/MockedNavigator';

describe('CommunityMembers', () => {
  const communityId = 1;
  const component = () => <CommunityMembers route={{ params: { communityId } }} />;

  it('should render search input correctly', () => {
    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const searchInput = wrapper.getByTestId('community_members.search');
    expect(searchInput).toBeDefined();
  });

  it('should render list data correctly', () => {
    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const searchInput = wrapper.getByTestId('member_list');
    expect(searchInput).toBeDefined();
  });
});
