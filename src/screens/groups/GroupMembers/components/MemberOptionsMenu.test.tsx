/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';

import i18next from 'i18next';
import {
  renderWithRedux,
  fireEvent,
  createTestStore,
} from '~/test/testUtils';
import MemberOptionsMenu from './MemberOptionsMenu';
import initialState from '~/storeRedux/initialState';
import { IGroupMembers } from '~/interfaces/IGroup';
import modalActions from '~/storeRedux/modal/actions';

describe('MemberOptionsMenu component', () => {
  const baseSheetRef = jest.fn();
  const groupId = '1';
  const onOptionsClosed = jest.fn();

  it('renders Remove member option correctly when admin clicks on another user', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.groupDetail.canManageMember = true;
    state.auth.user = { username: 'testname1' };
    const store = createTestStore(state);
    const selectedMember = {
      id: '1',
      username: 'testname2',
    } as IGroupMembers;

    const { getByTestId } = renderWithRedux(
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
    expect(itemComponent.props).toHaveProperty('onClick');
    fireEvent.press(itemComponent);
  });

  it('should not render Remove member option correctly when admins click on themselves', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.groupDetail.canManageMember = true;
    state.auth.user = { username: 'testname1' };
    const store = createTestStore(state);
    const selectedMember = {
      id: '1',
      username: 'testname1',
    } as IGroupMembers;

    const { queryByTestId } = renderWithRedux(
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

  it('should render Remove admin option correctly', () => {
    const state = { ...initialState };
    // @ts-ignore
    state.groups.groupDetail.canSetting = true;
    const store = createTestStore(state);

    const selectedMember = {
      id: '1',
      isAdmin: true,
    } as IGroupMembers;

    const { getByTestId } = renderWithRedux(
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
    const state = { ...initialState };
    // @ts-ignore
    state.groups.groupDetail.canSetting = true;
    state.groups.groupMembers = {
      // @ts-ignore
      groupAdmin: { userCount: 2 },
    };
    const store = createTestStore(state);

    const selectedMember = {
      id: '1',
      isAdmin: true,
    } as IGroupMembers;

    const { getByTestId } = renderWithRedux(
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
    expect(item.props).toHaveProperty('onClick');
  });

  it('should dispatch alert last admin error correctly', () => {
    const spy = jest.spyOn(modalActions, 'showHideToastMessage');

    const state = { ...initialState };
    // @ts-ignore
    state.groups.groupDetail.canSetting = true;
    state.groups.groupMembers = { groupAdmin: { userCount: 1 } } as any;
    state.auth.user = { username: 'testname1' } as any;
    const store = createTestStore(state);

    const selectedMember = {
      id: '1',
      isAdmin: true,
    } as IGroupMembers;

    const { getByTestId } = renderWithRedux(
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
    expect(item.props).toHaveProperty('onClick');
    fireEvent.press(item);
    expect(spy).toBeCalled();
  });

  it('should render set admin option correctly', () => {
    const spy = jest.spyOn(modalActions, 'showAlert');

    const state = { ...initialState };
    // @ts-ignore
    state.groups.groupDetail.canSetting = true;
    state.auth.user = { username: 'testname1' } as any;
    const store = createTestStore(state);

    const selectedMember = {
      id: '1',
      isAdmin: false,
    } as IGroupMembers;

    const { getByTestId } = renderWithRedux(
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
    expect(item.props).toHaveProperty('onClick');
    fireEvent.press(item);
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        title: i18next.t('groups:modal_confirm_set_admin:title'),
      }),
    );
  });
});
