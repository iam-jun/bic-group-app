/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { render } from '~/test/testUtils';
import GroupMembers from '.';
import MockedNavigator from '~/test/MockedNavigator';
import { MEMBER_TABS } from '~/screens/communities/CommunityMembers';

describe('GroupMembers component', () => {
  const groupId = '1';
  const component = () => <GroupMembers route={{ params: { groupId } }} />;

  it('should render the component with the correct header title', () => {
    const wrapper = render(<MockedNavigator component={component} />);
    const titleHeader = wrapper.getByTestId('header.text');

    expect(titleHeader.props.children).toEqual('Members');
  });

  it('should render correct tab', () => {
    const wrapper = render(<MockedNavigator component={component} />);
    const tabMemberList = wrapper.queryByTestId(`tab-button-${MEMBER_TABS[0].text}`);
    const tabMembersRequest = wrapper.queryByTestId(`tab-button-${MEMBER_TABS[1].text}`);

    expect(tabMemberList).toBeDefined();
    expect(tabMembersRequest).toBeDefined();
  });

  it('should render list data correctly', () => {
    const wrapper = render(<MockedNavigator component={component} />);
    const listMemberComponent = wrapper.getByTestId('member_list');
    expect(listMemberComponent).toBeDefined();
  });
});
