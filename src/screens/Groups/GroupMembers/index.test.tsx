import React from 'react';
import {renderWithRedux, fireEvent} from '~/test/testUtils';
import GroupMembers from '.';
import MockedNavigator from '~/test/MockedNavigator';
import initialState from '~/store/initialState';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/GroupStack/stack';

describe('GroupMembers component', () => {
  const groupId = 1;
  const component = () => <GroupMembers route={{params: {groupId}}} />;

  it('should render search input correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'username'};

    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const searchInput = wrapper.getByTestId('group_members.search');
    expect(searchInput).toBeDefined();
  });

  it('should render list data correctly', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'username'};

    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const memberListComp = wrapper.getByTestId('member_list');
    expect(memberListComp).toBeDefined();
  });

  it('should render Invite member button and navigate to Invite member screen correctly when user can manage member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'username'};
    const navigate = jest.fn();
    const rootNavigation = {navigate};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });
    state.groups.groupDetail.can_manage_member = true;

    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const inviteBtn = wrapper.getByTestId('group_members.invite');
    expect(inviteBtn).toBeDefined();
    fireEvent.press(inviteBtn);
    expect(navigate).toBeCalledWith(groupStack.inviteMembers, {groupId});
  });

  it('should NOT render Invite member button correctly when user cannot manage member', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'username'};
    state.groups.groupDetail.can_manage_member = false;

    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const inviteBtn = wrapper.queryByTestId('group_members.invite');
    expect(inviteBtn).toBeNull();
  });
});
