import React from 'react';

import MemberItem from './MemberItem';
import initialState from '~/store/initialState';
import { renderWithRedux, createTestStore, fireEvent } from '~/test/testUtils';
import { adminDetail } from '~/test/mock_data/communities';
import * as navigationHook from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

describe('MemberItem component', () => {
  const canManageMember = true;
  const onPressMenu = jest.fn();

  it('should render data correctly', () => {
    const state = { ...initialState };
    state.auth.user = { username: 'test' };
    const item = { ...adminDetail };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberItem
        item={item}
        canManageMember={canManageMember}
        onPressMenu={onPressMenu}
      />,
      store,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render icon member option correctly when user is an admin', () => {
    const state = { ...initialState };
    state.auth.user = { username: 'anothertest' };
    const item = { ...adminDetail };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberItem
        item={item}
        canManageMember={canManageMember}
        onPressMenu={onPressMenu}
      />,
      store,
    );
    const iconOption = wrapper.getByTestId('member_item.icon_option.button');
    expect(iconOption).toBeDefined();
    fireEvent.press(iconOption);
    expect(wrapper).toMatchSnapshot();
  });

  it('should NOT render icon member option correctly when user is NOT an admin', () => {
    const state = { ...initialState };
    state.auth.user = { username: 'anothertest' };
    const item = { ...adminDetail };
    const store = createTestStore(state);
    const wrapper = renderWithRedux(
      <MemberItem
        item={item}
        canManageMember={false}
        onPressMenu={onPressMenu}
      />,
      store,
    );
    const iconClose = wrapper.queryByTestId('member_item.icon_option.button');
    expect(iconClose).toBeNull();
  });

  it('should navigate to User profile correctly', () => {
    const state = { ...initialState };
    state.auth.user = { username: 'test' };
    const item = { ...adminDetail };
    const store = createTestStore(state);
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <MemberItem
        item={item}
        canManageMember={canManageMember}
        onPressMenu={onPressMenu}
      />,
      store,
    );

    const memberItem = wrapper.getByTestId('member_item');
    fireEvent.press(memberItem);
    expect(navigate).toBeCalledWith(mainStack.userProfile, {
      userId: adminDetail.id,
    });
  });
});
