import React from 'react';
import { renderWithRedux } from '~/test/testUtils';
import CommunityMembers, { MEMBER_TABS } from './index';
import MockedNavigator from '../../../test/MockedNavigator';

describe('CommunityMembers', () => {
  const communityId = 1;
  const component = () => <CommunityMembers route={{ params: { communityId } }} />;

  it('should render correct tab', () => {
    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const tabMemberList = wrapper.queryByTestId(`tab-button-${MEMBER_TABS[0].text}`);
    const tabMembersRequest = wrapper.queryByTestId(`tab-button-${MEMBER_TABS[1].text}`);

    expect(tabMemberList).toBeDefined();
    expect(tabMembersRequest).toBeDefined();
  });

  it('should render list data correctly', () => {
    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const listMemberComponent = wrapper.getByTestId('member_list');
    expect(listMemberComponent).toBeDefined();
  });
});
