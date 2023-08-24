import React from 'react';
import useAuthController, { IAuthState } from '~/screens/auth/store';

import MemberItem from './MemberItem';
import { render, fireEvent } from '~/test/testUtils';
import { adminDetail, previewMemberDetail } from '~/test/mock_data/communities';
import * as navigationHook from '~/hooks/navigation';
import mainStack from '~/router/navigator/MainStack/stack';

describe('MemberItem component', () => {
  const canManageMember = true;
  const onPressMenu = jest.fn();
  const communityId = 'test';

  it('should render data correctly for own item and not have admin role', () => {
    const item = { ...adminDetail };
    useAuthController.setState((state:IAuthState) => {
      state.authUser = { username: 'test' } as any;
      return state;
    });
    const { getByTestId, queryByTestId } = render(
      <MemberItem
        item={item}
        communityId={communityId}
        isAdminRole
        canManageMember={false}
        onPressMenu={onPressMenu}
      />,
    );
    const fullnameComp = getByTestId('member_item.name');
    const usernameComp = getByTestId('member_item.username');
    const iconChat = queryByTestId('member_item.icon_chat.button');
    const iconOptions = queryByTestId('member_item.icon_option.button');
    expect(fullnameComp.props.children).toEqual(`${previewMemberDetail.fullname} (You)`);
    expect(usernameComp.props.children).toEqual(`@${previewMemberDetail.username}`);
    expect(iconChat).toBeNull();
    expect(iconOptions).toBeNull();
  });

  it('should render data correctly for other memnber item and NOT have admin role', () => {
    useAuthController.setState((state:IAuthState) => {
      state.authUser = { username: 'anothertest' } as any;
      return state;
    });
    const item = { ...adminDetail };
    const { getByTestId, queryByTestId } = render(
      <MemberItem
        item={item}
        communityId={communityId}
        isAdminRole={false}
        canManageMember={false}
        onPressMenu={onPressMenu}
      />,
    );
    const fullnameComp = getByTestId('member_item.name');
    const usernameComp = getByTestId('member_item.username');
    const iconChat = queryByTestId('member_item.icon_chat.button');
    const iconOptions = queryByTestId('member_item.icon_option.button');
    expect(fullnameComp.props.children).toEqual(`${previewMemberDetail.fullname}`);
    expect(usernameComp.props.children).toEqual(`@${previewMemberDetail.username}`);
    expect(iconChat).toBeNull();
    expect(iconOptions).not.toBeNull();
  });

  it('should render data correctly for other memnber item and have admin role', () => {
    useAuthController.setState((state:IAuthState) => {
      state.authUser = { username: 'anothertest' } as any;
      return state;
    });
    const item = { ...adminDetail };
    const { getByTestId, queryByTestId } = render(
      <MemberItem
        item={item}
        communityId={communityId}
        isAdminRole
        canManageMember={false}
        onPressMenu={onPressMenu}
      />,
    );
    const fullnameComp = getByTestId('member_item.name');
    const usernameComp = getByTestId('member_item.username');
    const iconChat = queryByTestId('member_item.icon_chat.button');
    const iconOptions = queryByTestId('member_item.icon_option.button');
    expect(fullnameComp.props.children).toEqual(`${previewMemberDetail.fullname}`);
    expect(usernameComp.props.children).toEqual(`@${previewMemberDetail.username}`);
    expect(iconChat).not.toBeNull();
    expect(iconOptions).not.toBeNull();
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

    const wrapper = render(
      <MemberItem
        item={item}
        communityId={communityId}
        isAdminRole={false}
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
