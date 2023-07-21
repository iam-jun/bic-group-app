import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import MenuHeader from './MenuHeader';
import * as navigationHook from '~/hooks/navigation';
import useCommonController from '~/screens/store';
import mainStack from '~/router/navigator/MainStack/stack';
import { mockBadgeList } from '~/test/mock_data/userProfile';

describe('MenuHeader component', () => {
  const fakeDataUserProfile = {
    id: 'test_id',
    fullname: 'Full Name',
    username: 'User Name',
    avatar: 'https://bein-entity-attribute-sandbox.s3.ap-southeast-1.amazonaws.com/user/avatar/images/original/05bcb2c1-2b5c-4f6e-b493-9183946c9318',
  };

  it('renders correctly', () => {
    useCommonController.setState((state) => {
      state.myProfile = fakeDataUserProfile as any;
      return state;
    });
    const rendered = render(<MenuHeader />);

    const fullNameComponent = rendered.getByTestId('menu_header.full_name');
    expect(fullNameComponent).toBeDefined();

    const fullNameTextComponent = rendered.getByTestId('menu_header.full_name.text');
    expect(fullNameTextComponent).toBeDefined();
    expect(fullNameTextComponent.props?.children?.[0]).toEqual(`${fakeDataUserProfile.fullname}`);

    const userNameComponent = rendered.getByTestId('menu_header.user_name');
    expect(userNameComponent).toBeDefined();

    const userNameTextComponent = rendered.getByTestId('menu_header.user_name.text');
    expect(userNameTextComponent).toBeDefined();
    expect(userNameTextComponent.props?.children).toEqual(['@', fakeDataUserProfile.username]);

    const avatarComponent = rendered.getByTestId('menu_header.avatar');
    expect(avatarComponent).toBeDefined();
  });

  it('should navigate to user profile screen when click fullname', () => {
    useCommonController.setState((state) => {
      state.myProfile = fakeDataUserProfile as any;
      return state;
    });
    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = render(<MenuHeader />);
    const itemComponent = rendered.getByTestId('menu_header.full_name');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(navigate).toHaveBeenCalledWith(mainStack.userProfile,
      { userId: fakeDataUserProfile.id, targetIndex: 0 });
  });

  it('should navigate to user profile screen when click username', () => {
    useCommonController.setState((state) => {
      state.myProfile = fakeDataUserProfile as any;
      return state;
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = render(<MenuHeader />);
    const itemComponent = rendered.getByTestId('menu_header.user_name');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(navigate).toHaveBeenCalledWith(mainStack.userProfile,
      { userId: fakeDataUserProfile.id, targetIndex: 0 });
  });

  it('should navigate to user profile screen when click avatar', () => {
    useCommonController.setState((state) => {
      state.myProfile = fakeDataUserProfile as any;
      return state;
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = render(<MenuHeader />);
    const itemComponent = rendered.getByTestId('menu_header.avatar');
    expect(itemComponent).toBeDefined();
    fireEvent.press(itemComponent);
    expect(navigate).toHaveBeenCalledWith(mainStack.userProfile,
      { userId: fakeDataUserProfile.id, targetIndex: 0 });
  });

  it('should navigate to user profile screen when click badge edit button', () => {
    const newUserProfile = { ...fakeDataUserProfile, showingBadges: [...mockBadgeList, undefined] };
    useCommonController.setState((state) => {
      state.myProfile = newUserProfile as any;
      return state;
    });

    const navigate = jest.fn();
    const rootNavigation = { navigate };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const rendered = render(<MenuHeader />);
    const editBadgeButton = rendered.queryAllByTestId('user_badge_item.empty');
    expect(editBadgeButton.length).toEqual(1);
    fireEvent.press(editBadgeButton[0]);
    expect(navigate).toHaveBeenCalledWith(mainStack.userProfile,
      { userId: fakeDataUserProfile.id, targetIndex: 1 });
  });
});
