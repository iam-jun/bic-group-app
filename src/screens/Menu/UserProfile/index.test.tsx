/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';
import {cleanup} from '@testing-library/react-native';

import initialState from '~/store/initialState';
import {
  configureStore,
  createTestStore,
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import * as navigationHook from '~/hooks/navigation';
import * as commonUtil from '~/utils/common';
import UserProfile from '.';
import {USER_PROFILE} from '~/test/mock_data/menu';
import mainStack from '~/router/navigator/MainStack/stack';
import menuTypes from '../redux/types';
import menuActions from '../redux/actions';

afterEach(cleanup);

describe('UserProfile screen', () => {
  const mockStore = configureStore([]);
  let storeData: any;

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = {...initialState};
    storeData.menu.myProfile = {} as any;
    storeData.auth.user = {} as any;
    storeData.menu.showUserNotFound = false;
    storeData.menu.loadingUserProfile = false;
  });

  it(`should hide avatar edit button, cover image edit button add edit profile button if is not current user`, () => {
    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_USER_PROFILE,
        payload: {...USER_PROFILE, id: 1},
      };
    };

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);

    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: 1}}};
    const wrapper = renderWithRedux(<UserProfile {...props} />, store);

    const buttonEditAvatar = wrapper.queryByTestId('user_profile.edit.avatar');
    expect(buttonEditAvatar).toBeNull();

    const buttonCoverImage = wrapper.queryByTestId(
      'user_profile.edit.cover_image',
    );
    expect(buttonCoverImage).toBeNull();

    const buttonEditUserProfile = wrapper.queryByTestId('user_profile.edit');
    expect(buttonEditUserProfile).toBeNull();

    const buttonSendMessage = wrapper.getByTestId('user_profile.message');
    expect(buttonSendMessage).not.toBeNull();
  });

  it(`should show avatar edit button, cover image edit button add edit profile button, hide Direct Message button if is current user`, () => {
    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_USER_PROFILE,
        payload: USER_PROFILE,
      };
    };

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);
    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };

    storeData.menu.myProfile = USER_PROFILE as any;
    storeData.auth.user = user as any;

    const store = createTestStore(storeData);
    const props = {route: {params: {userId: USER_PROFILE.id}}};
    const wrapper = renderWithRedux(<UserProfile {...props} />, store);

    const buttonEditAvatar = wrapper.queryByTestId('user_profile.edit.avatar');
    expect(buttonEditAvatar).toBeDefined();
    //@ts-ignore
    fireEvent.press(buttonEditAvatar);

    const buttonCoverImage = wrapper.queryByTestId(
      'user_profile.edit.cover_image',
    );
    expect(buttonCoverImage).toBeDefined();

    const coverImageView = wrapper.getByTestId('user_profile.cover_image');

    fireEvent(coverImageView, 'layout', {
      nativeEvent: {layout: {width: 375}},
    });

    const buttonEditUserProfile = wrapper.queryByTestId('user_profile.edit');
    expect(buttonEditUserProfile).toBeDefined();

    const buttonSendMessage = wrapper.queryByTestId('user_profile.message');
    expect(buttonSendMessage).toBeNull();
  });

  it(`should navigate to UserEditProfile screen when click button edit profile`, () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_USER_PROFILE,
        payload: USER_PROFILE,
      };
    };

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);
    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;
    storeData.auth.user = user as any;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: USER_PROFILE.id}}};
    const wrapper = renderWithRedux(<UserProfile {...props} />, store);

    const buttonEditUserProfile = wrapper.getByTestId('user_profile.edit');
    expect(buttonEditUserProfile).toBeDefined();

    fireEvent.press(buttonEditUserProfile);

    expect(navigate).toHaveBeenCalledWith(mainStack.userEdit, {
      userId: USER_PROFILE.id,
    });
  });

  it(`should redirect to app chat when click Direct Message button`, () => {
    const spy = jest.spyOn(commonUtil, 'openLink');

    const mockActionGetUserProfile = () => {
      return {
        type: menuTypes.SET_USER_PROFILE,
        payload: {...USER_PROFILE, id: 1},
      };
    };

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetUserProfile as any);
    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;
    storeData.auth.user = user as any;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: 1}}};
    const wrapper = renderWithRedux(<UserProfile {...props} />, store);

    const buttonDirectMessage = wrapper.getByTestId('user_profile.message');
    expect(buttonDirectMessage).toBeDefined();

    fireEvent.press(buttonDirectMessage);
    expect(spy).toBeCalled();
  });

  it(`should navigate to UserEditProfile screen when click button View more about info...`, () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const mockActionGeUserProfile = () => {
      return {
        type: menuTypes.SET_USER_PROFILE,
        payload: {...USER_PROFILE, id: 1},
      };
    };

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGeUserProfile as any);
    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;
    storeData.auth.user = user as any;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: 1}}};
    const wrapper = renderWithRedux(<UserProfile {...props} />, store);

    const buttonViewMore = wrapper.getByTestId('user_profile.view_more');
    expect(buttonViewMore).toBeDefined();

    fireEvent.press(buttonViewMore);

    expect(navigate).toHaveBeenCalledWith(mainStack.userEdit, {
      userId: 1,
    });
  });

  it(`should show select photos when clicking the cover image edit button if is the current user`, () => {
    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_USER_PROFILE,
        payload: USER_PROFILE,
      };
    };

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);
    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;
    storeData.auth.user = user as any;
    storeData.menu.showUserNotFound = false;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: USER_PROFILE.id}}};
    const wrapper = renderWithRedux(<UserProfile {...props} />, store);

    const buttonCoverImage = wrapper.queryByTestId(
      'user_profile.edit.cover_image',
    );
    expect(buttonCoverImage).toBeDefined();

    //@ts-ignore
    fireEvent.press(buttonCoverImage);

    const coverImageView = wrapper.getByTestId('user_profile.cover_image');

    fireEvent(coverImageView, 'layout', {
      nativeEvent: {layout: {width: 375}},
    });

    const buttonEditUserProfile = wrapper.queryByTestId('user_profile.edit');
    expect(buttonEditUserProfile).toBeDefined();

    const buttonSendMessage = wrapper.queryByTestId('user_profile.message');
    expect(buttonSendMessage).toBeNull();
  });

  it(`should render loading when loadingUserProfile is true`, () => {
    //@ts-ignore
    storeData.menu.loadingUserProfile = true;
    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    storeData.auth.user = user as any;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: 1}}};
    const wrapper = renderWithRedux(<UserProfile {...props} />, store);

    const loadingView = wrapper.getByTestId('user_profile.loading');
    expect(loadingView).toBeDefined();
  });

  it(`should render NoUserFound if can't get user profile`, () => {
    //@ts-ignore
    storeData.menu.showUserNotFound = true;
    const store = mockStore(storeData);
    const props = {route: {params: {userId: 1}}};
    const wrapper = renderWithRedux(<UserProfile {...props} />, store);

    const userNotFound = wrapper.getByTestId('user_profile.not_found');
    expect(userNotFound).toBeDefined();
  });

  // it(`should not run onCoverLayout function when onLayout return width = 0`, () => {
  //   const mockActionGetMyProfile = () => {
  //     return {
  //       type: menuTypes.SET_USER_PROFILE,
  //       payload: USER_PROFILE,
  //     };
  //   };

  //   jest
  //     .spyOn(menuActions, 'getUserProfile')
  //     .mockImplementation(mockActionGetMyProfile as any);
  //   const user = {
  //     signInUserSession: {
  //       idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
  //     },
  //   };
  //   //@ts-ignore
  //   storeData.menu.myProfile = USER_PROFILE;
  //   storeData.auth.user = user as any;

  //   const store = mockStore(storeData);
  //   const props = {route: {params: {userId: USER_PROFILE.id}}};
  //   const wrapper = renderWithRedux(<UserProfile {...props} />, store);

  //   const coverImageView = wrapper.getByTestId('user_profile.cover_image');

  //   fireEvent(coverImageView, 'layout', {
  //     nativeEvent: {layout: {width: 0}},
  //   });
  // });
});
