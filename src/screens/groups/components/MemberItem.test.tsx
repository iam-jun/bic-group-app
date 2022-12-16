import React from 'react';
import useAuthController, { IAuthState } from '~/screens/auth/store';

import MemberItem from './MemberItem';
import { renderWithRedux, fireEvent } from '~/test/testUtils';
import { adminDetail } from '~/test/mock_data/communities';
import * as navigationHook from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

describe('MemberItem component', () => {
  const canManageMember = true;
  const onPressMenu = jest.fn();

  it('should render data correctly', () => {
    const item = { ...adminDetail };
    useAuthController.setState((state:IAuthState) => {
      state.authUser = { username: 'test' } as any;
      return state;
    });
    const wrapper = renderWithRedux(
      <MemberItem
        item={item}
        canManageMember={canManageMember}
        onPressMenu={onPressMenu}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render icon member option correctly when user is an admin', () => {
    useAuthController.setState((state:IAuthState) => {
      state.authUser = { username: 'anothertest' } as any;
      return state;
    });
    const item = { ...adminDetail };
    const wrapper = renderWithRedux(
      <MemberItem
        item={item}
        canManageMember={canManageMember}
        onPressMenu={onPressMenu}
      />,
    );
    const iconOption = wrapper.getByTestId('member_item.icon_option.button');
    expect(iconOption).toBeDefined();
    fireEvent.press(iconOption);
    expect(wrapper).toMatchSnapshot();
  });

  it('should NOT render icon member option correctly when user is NOT an admin', () => {
    useAuthController.setState((state:IAuthState) => {
      state.authUser = { username: 'anothertest' } as any;
      return state;
    });
    const item = { ...adminDetail };
    const wrapper = renderWithRedux(
      <MemberItem
        item={item}
        canManageMember={false}
        onPressMenu={onPressMenu}
      />,
    );
    const iconClose = wrapper.queryByTestId('member_item.icon_option.button');
    expect(iconClose).toBeNull();
  });

  it('should navigate to User profile correctly', () => {
    useAuthController.setState((state:IAuthState) => {
      state.authUser = { username: 'test' } as any;
      return state;
    });
    const item = { ...adminDetail };
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(
      <MemberItem
        item={item}
        canManageMember={canManageMember}
        onPressMenu={onPressMenu}
      />,
    );

    const memberItem = wrapper.getByTestId('member_item');
    fireEvent.press(memberItem);
    expect(navigate).toBeCalledWith(mainStack.userProfile, {
      userId: adminDetail.id,
    });
  });
});
