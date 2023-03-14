import React from 'react';
import { fireEvent, renderWithRedux } from '~/test/testUtils';
import CommunityMembers, { MEMBER_TABS } from './index';
import MockedNavigator from '../../../test/MockedNavigator';

describe('CommunityMembers', () => {
  const communityId = 1;
  const component = () => <CommunityMembers route={{ params: { communityId, isMember: true } }} />;

  it('should render the component with the correct header title', () => {
    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const titleHeader = wrapper.getByTestId('header.text');

    expect(titleHeader.props.children).toEqual('Members');
  });

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

  it('should show search view when pressing icon search', () => {
    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const iconSearch = wrapper.getByTestId('header.icon.button');
    fireEvent.press(iconSearch);
    const searchView = wrapper.getByTestId('search_base_view');
    expect(searchView).toBeDefined();
  });

  it('should show CommunityMemberRequests when targetIndex = 1', () => {
    const component = () => <CommunityMembers route={{ params: { communityId, isMember: true, targetIndex: 1 } }} />;
    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const communityMemberRequests = wrapper.getByTestId('community_member_requests');
    expect(communityMemberRequests).toBeDefined();
  });
});
