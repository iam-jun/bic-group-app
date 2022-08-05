import React from 'react';
import MockedNavigator from '~/test/MockedNavigator';
import { renderWithRedux, createTestStore, fireEvent } from '~/test/testUtils';
import GroupTopBar from './GroupTopBar';
import initialState from '~/store/initialState';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { communityDetailData } from '~/test/mock_data/communities';

describe('GroupTopBar component', () => {
  it('renders Search icon correctly', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.auth.user = { username: 'testname1' };
    state.groups.groupDetail.joinStatus = groupJoinStatus.member;
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={GroupTopBar} />,
      store,
    );
    const component = wrapper.getByTestId('group_top_bar.search');
    expect(component).toBeDefined();
    fireEvent.press(component);
  });

  it('renders Chat icon correctly', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.auth.user = { username: 'testname1' };
    state.groups.groupDetail.joinStatus = groupJoinStatus.member;
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={GroupTopBar} />,
      store,
    );
    const component = wrapper.getByTestId('group_top_bar.chat');
    expect(component).toBeDefined();
    fireEvent.press(component);
  });

  it('renders Admin icon correctly when user is an admin', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.auth.user = { username: 'testname1' };
    state.groups.groupDetail.joinStatus = groupJoinStatus.member;
    state.groups.groupDetail.canSetting = true;
    state.groups.groupDetail.group = { ...communityDetailData };
    state.groups.myPermissions = {
      data: {
        groups: {
          1: [
            'report_member_in_group',
            'approve_reject_group_joining_requests',
            'edit_group_information',
            'edit_group_privacy',
          ],
        },
      },
    };
    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={GroupTopBar} />,
      store,
    );
    const component = wrapper.getByTestId('group_top_bar.admin_button');
    expect(component).toBeDefined();
    fireEvent.press(component);
    const optionMenu = wrapper.queryByTestId('group_top_bar.option_menu');
    expect(optionMenu).toBeNull();
  });

  it('should render group option menu correctly when user is not an admin', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.auth.user = { username: 'testname1' };
    state.groups.groupDetail.joinStatus = groupJoinStatus.member;
    state.groups.myPermissions = {
      data: {
        groups: {
        },
      },
    };

    const store = createTestStore(state);

    const wrapper = renderWithRedux(
      <MockedNavigator component={GroupTopBar} />,
      store,
    );
    const component = wrapper.queryByTestId('group_top_bar.admin_button');
    expect(component).toBeNull();

    const optionMenu = wrapper.queryByTestId('group_top_bar.option_menu');
    expect(optionMenu).toBeDefined();
    fireEvent.press(optionMenu);
  });

  //  code have been updated in screen
  //   it('should replace with screen groups', () => {
  //     const state = {...initialState};
  //     const store = createTestStore(state);
  //     const replace = jest.fn();
  //     const rootNavigation = {replace};
  //     jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
  //       return {rootNavigation} as any;
  //     });
  //     const wrapper = renderWithRedux(
  //       <MockedNavigator component={GroupTopBar} />,
  //       store,
  //     );
  //     const btnBack = wrapper.getByTestId('group_top_bar.back');
  //     fireEvent.press(btnBack);
  //     expect(replace).toBeCalledWith(groupStack.groups);
  //   });
});
