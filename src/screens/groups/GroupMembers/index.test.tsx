/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { renderWithRedux, fireEvent } from '~/test/testUtils';
import GroupMembers from '.';
import MockedNavigator from '~/test/MockedNavigator';
import initialState from '~/storeRedux/initialState';
import * as navigationHook from '~/hooks/navigation';
import groupStack from '~/router/navigator/MainStack/stacks/groupStack/stack';

describe('GroupMembers component', () => {
  const groupId = '1';
  const component = () => <GroupMembers route={{ params: { groupId } }} />;

  it('should render list data correctly', () => {
    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const memberListComp = wrapper.getByTestId('member_list');
    expect(memberListComp).toBeDefined();
  });

  it('should render Invite member button and navigate to Invite member screen correctly when user can manage member', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.myPermissions = {
      data: {
        groups: {
          1: [
            'add_remove_group_members',
          ],
        },
      },
    };
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const inviteBtn = wrapper.getByTestId('group_members.invite');
    expect(inviteBtn).toBeDefined();
    fireEvent.press(inviteBtn);
    expect(navigate).toBeCalledWith(groupStack.addMembers, { groupId });
  });

  it('should NOT render Invite member button correctly when user cannot manage member', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.myPermissions = { data: { groups: {} } };
    const wrapper = renderWithRedux(<MockedNavigator component={component} />);
    const inviteBtn = wrapper.queryByTestId('group_members.invite');
    expect(inviteBtn).toBeNull();
  });
});
