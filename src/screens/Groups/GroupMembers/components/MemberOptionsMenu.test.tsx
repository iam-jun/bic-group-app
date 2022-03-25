import React from 'react';

import {renderWithRedux, fireEvent, createTestStore} from '~/test/testUtils';
import MemberOptionsMenu from './MemberOptionsMenu';
import initialState from '~/store/initialState';
import {IGroupMembers} from '~/interfaces/IGroup';

describe('MemberOptionsMenu component', () => {
  const baseSheetRef = jest.fn();
  const groupId = 1;
  const onOptionsClosed = jest.fn();

  it('renders correctly', () => {
    const rendered = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
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
    const selectedUser = {
      id: 1,
      username: 'testname2',
    } as IGroupMembers;

    const {getByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedUser}
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
    const selectedUser = {
      id: 1,
      username: 'testname1',
    } as IGroupMembers;

    const {queryByTestId} = renderWithRedux(
      <MemberOptionsMenu
        groupId={groupId}
        modalizeRef={baseSheetRef}
        selectedMember={selectedUser}
        onOptionsClosed={onOptionsClosed}
      />,
      store,
    );
    const itemComponent = queryByTestId('member_options_menu.remove_member');
    expect(itemComponent).toBeNull();
  });
});
