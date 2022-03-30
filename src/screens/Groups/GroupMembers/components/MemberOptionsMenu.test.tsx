import React from 'react';

import {
  renderWithRedux,
  fireEvent,
  createTestStore,
  getHookReduxWrapper,
  renderHook,
  act,
} from '~/test/testUtils';
import MemberOptionsMenu from './MemberOptionsMenu';
import initialState from '~/store/initialState';
import {IGroupMembers} from '~/interfaces/IGroup';
import useRemoveMember from './useRemoveMember';
import useRemoveAdmin from './useRemoveAdmin';

describe('MemberOptionsMenu component', () => {
  const baseSheetRef = jest.fn();
  const groupId = 1;
  const onOptionsClosed = jest.fn();
  const selectedMember = {};

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        selectedMember={selectedMember}
        modalizeRef={baseSheetRef}
        onOptionsClosed={onOptionsClosed}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('renders leave group option correctly', () => {
    const {getByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        selectedMember={selectedMember}
        modalizeRef={baseSheetRef}
        onOptionsClosed={onOptionsClosed}
      />,
    );
    const itemComponent = getByTestId('member_options_menu.leave_group');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
  });

  it('renders Remove member option correctly when admin clicks on another user', () => {
    const state = {...initialState};
    state.groups.groupDetail.can_manage_member = true;
    // @ts-ignore
    state.auth.user = {username: 'testname1'};
    const store = createTestStore(state);
    const selectedMember = {
      id: 1,
      username: 'testname2',
    } as IGroupMembers;

    const {getByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember}
        onOptionsClosed={onOptionsClosed}
      />,
      store,
    );
    const itemComponent = getByTestId('member_options_menu.remove_member');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
  });

  it('should not render Remove member option correctly when admins click on themselves', () => {
    const state = {...initialState};
    state.groups.groupDetail.can_manage_member = true;
    // @ts-ignore
    state.auth.user = {username: 'testname1'};
    const store = createTestStore(state);
    const selectedMember = {
      id: 1,
      username: 'testname1',
    } as IGroupMembers;

    const {queryByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember}
        onOptionsClosed={onOptionsClosed}
      />,
      store,
    );
    const itemComponent = queryByTestId('member_options_menu.remove_member');
    expect(itemComponent).toBeNull();
  });

  it('getInnerGroupsNames should be done when there is no inner groups', () => {
    const renderInnerGroupsAlert = jest.fn();
    const state = {...initialState};
    const store = createTestStore(state);

    const wrapper = getHookReduxWrapper(store);
    const {result} = renderHook(
      () => useRemoveMember({groupId, selectedMember}),
      {
        wrapper,
      },
    );
    let pressResult;
    act(() => {
      pressResult = result.current.getInnerGroupsNames(
        [],
        renderInnerGroupsAlert,
      );
    });
    expect(pressResult).toBe(0);
  });

  it('getInnerGroupsNames should be done when there is 1 inner group', () => {
    const renderInnerGroupsAlert = jest.fn();
    const state = {...initialState};
    const store = createTestStore(state);

    const wrapper = getHookReduxWrapper(store);
    const {result} = renderHook(
      () => useRemoveMember({groupId, selectedMember}),
      {
        wrapper,
      },
    );
    let pressResult;
    act(() => {
      pressResult = result.current.getInnerGroupsNames(
        ['inner group 1'],
        renderInnerGroupsAlert,
      );
    });
    expect(pressResult).toBe(1);
  });

  it('getInnerGroupsNames should be done when there are at least 2 inner groups', () => {
    const renderInnerGroupsAlert = jest.fn();
    const state = {...initialState};
    const store = createTestStore(state);

    const wrapper = getHookReduxWrapper(store);
    const {result} = renderHook(
      () => useRemoveMember({groupId, selectedMember}),
      {
        wrapper,
      },
    );
    let pressResult;
    act(() => {
      pressResult = result.current.getInnerGroupsNames(
        ['inner group 1', 'inner group 2', 'inner group 3'],
        renderInnerGroupsAlert,
      );
    });
    expect(pressResult).toBe(1);
  });

  it('should render Remove admin option correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail.can_setting = true;
    const store = createTestStore(state);

    const selectedMember = {
      id: 1,
      roles: [{type: 'GROUP_ADMIN'}],
    } as IGroupMembers;

    const {getByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember}
        onOptionsClosed={onOptionsClosed}
      />,
      store,
    );

    const item = getByTestId('member_options_menu.remove_admin');
    expect(item).toBeDefined();
  });

  it('should dispatch alertRemovingAdmin correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail.can_setting = true;
    state.groups.groupMember = {
      // @ts-ignore
      group_admin: {user_count: 2},
    };
    const store = createTestStore(state);

    const selectedMember = {
      id: 1,
      roles: [{type: 'GROUP_ADMIN'}],
    } as IGroupMembers;

    const {getByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember}
        onOptionsClosed={onOptionsClosed}
      />,
      store,
    );

    const item = getByTestId('member_options_menu.remove_admin');
    expect(item).toBeDefined();
    fireEvent.press(item);
  });

  it('should dispatch alert last admin error correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail.can_setting = true;
    state.groups.groupMember = {
      // @ts-ignore
      group_admin: {user_count: 1},
    };
    const store = createTestStore(state);

    const selectedMember = {
      id: 1,
      roles: [{type: 'GROUP_ADMIN'}],
    } as IGroupMembers;

    const {getByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember}
        onOptionsClosed={onOptionsClosed}
      />,
      store,
    );

    const item = getByTestId('member_options_menu.remove_admin');
    expect(item).toBeDefined();
    fireEvent.press(item);
  });

  it('should render set admin option correctly', () => {
    const state = {...initialState};
    state.groups.groupDetail.can_setting = true;
    const store = createTestStore(state);

    const selectedMember = {
      id: 1,
      roles: [{type: 'MEMBER'}],
    } as IGroupMembers;

    const {getByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember}
        onOptionsClosed={onOptionsClosed}
      />,
      store,
    );

    const item = getByTestId('member_options_menu.set_admin');
    expect(item).toBeDefined();
    fireEvent.press(item);
  });

  it('should render View profile option correctly', () => {
    const selectedMember = {
      id: 1,
      roles: [{type: 'MEMBER'}],
    } as IGroupMembers;

    const {getByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember}
        onOptionsClosed={onOptionsClosed}
      />,
    );

    const item = getByTestId('member_options_menu.view_profile');
    expect(item).toBeDefined();
    fireEvent.press(item);
  });

  it('renders Send message option correctly when admin clicks on another user', () => {
    const state = {...initialState};
    // @ts-ignore
    state.auth.user = {username: 'testname1'};
    const store = createTestStore(state);
    const selectedMember = {
      id: 1,
      username: 'testname2',
    } as IGroupMembers;

    const {getByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedMember}
        onOptionsClosed={onOptionsClosed}
      />,
      store,
    );
    const itemComponent = getByTestId('member_options_menu.send_message');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
  });
});
