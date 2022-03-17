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

import UserEditProfile from './UserEditProfile';
import {USER_PROFILE, WORK_EXPERIENCE} from '~/test/mock_data/menu';
import mainStack from '~/router/navigator/MainStack/stack';
import menuTypes from '../redux/types';
import menuActions from '../redux/actions';

afterEach(cleanup);

jest.mock('~/utils/permission', () => ({
  checkPermission: jest.fn().mockImplementation(() => {
    return true;
  }),
}));

describe('UserEditProfile screen', () => {
  const mockStore = configureStore([]);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should hide avatar, cover image, description, add work exp button and edit button in each item if is not current user`, async () => {
    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_USER_PROFILE,
        payload: {...USER_PROFILE, id: 1},
      };
    };

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);

    const mockActionGetMyWorkEXP = () => {
      return {
        type: menuTypes.SET_USER_WORK_EXPERIENCE,
        payload: WORK_EXPERIENCE,
      };
    };

    jest
      .spyOn(menuActions, 'getMyWorkExperience')
      .mockImplementation(mockActionGetMyWorkEXP as any);

    const storeData = {...initialState};
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: 1}}};
    const wrapper = renderWithRedux(<UserEditProfile {...props} />, store);

    const buttonEditAvatar = wrapper.queryByTestId(
      'user_edit_profile.avatar.edit',
    );
    expect(buttonEditAvatar).toBeNull();

    const buttonCoverImage = wrapper.queryByTestId(
      'user_edit_profile.cover.edit',
    );
    expect(buttonCoverImage).toBeNull();

    const buttonEditDescription = wrapper.queryByTestId(
      'user_edit_profile.description.edit',
    );
    expect(buttonEditDescription).toBeNull();

    const buttonAddWork = wrapper.queryByTestId(
      'user_edit_profile.work.add_work',
    );
    expect(buttonAddWork).toBeNull();
  });

  it(`should show avatar, cover image, description, add work exp button and edit button in each item if is current user`, async () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });
    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    const storeData = {...initialState};

    storeData.auth.user = user as any;

    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;
    //@ts-ignore
    storeData.menu.myWorkExperience = WORK_EXPERIENCE;

    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_MY_PROFILE,
        payload: USER_PROFILE,
      };
    };

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);

    const mockActiongetMyWorkEXP = () => {
      return {
        type: menuTypes.SET_MY_WORK_EXPERIENCE,
        payload: WORK_EXPERIENCE,
      };
    };

    jest
      .spyOn(menuActions, 'getMyWorkExperience')
      .mockImplementation(mockActiongetMyWorkEXP as any);

    const store = createTestStore(storeData);
    const props = {route: {params: {userId: USER_PROFILE.id}}};

    const wrapper = renderWithRedux(<UserEditProfile {...props} />, store);

    const buttonEditAvatar = wrapper.getByTestId(
      'user_edit_profile.avatar.edit',
    );
    expect(buttonEditAvatar).toBeDefined();

    const buttonCoverImage = wrapper.getByTestId(
      'user_edit_profile.cover.edit',
    );
    expect(buttonCoverImage).toBeDefined();

    const buttonEditDescription = wrapper.getByTestId(
      'user_edit_profile.description.edit',
    );
    expect(buttonEditDescription).toBeDefined();

    const buttonAddWork = wrapper.getByTestId(
      'user_edit_profile.work.add_work',
    );
    expect(buttonAddWork).toBeDefined();
  });

  it(`should navigate to screen edit description when click edit description`, async () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });
    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    const storeData = {...initialState};

    storeData.auth.user = user as any;
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;

    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_MY_PROFILE,
        payload: USER_PROFILE,
      };
    };

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);

    const mockActionGetMyWorkEXP = () => {
      return {
        type: menuTypes.SET_MY_WORK_EXPERIENCE,
        payload: WORK_EXPERIENCE,
      };
    };

    jest
      .spyOn(menuActions, 'getMyWorkExperience')
      .mockImplementation(mockActionGetMyWorkEXP as any);

    const store = mockStore(storeData);
    const props = {route: {params: {userId: USER_PROFILE.id}}};

    const wrapper = renderWithRedux(<UserEditProfile {...props} />, store);

    const buttonEdit = wrapper.getByTestId(
      'user_edit_profile.description.edit',
    );
    expect(buttonEdit).toBeDefined();
    fireEvent.press(buttonEdit);

    expect(navigate).toBeCalledWith(mainStack.editDescription);
  });

  it(`should navigate to screen edit basic info when click edit basic info`, async () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_MY_PROFILE,
        payload: USER_PROFILE,
      };
    };
    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);

    const mockActionGetMyWorkEXP = () => {
      return {
        type: menuTypes.SET_MY_WORK_EXPERIENCE,
        payload: WORK_EXPERIENCE,
      };
    };

    jest
      .spyOn(menuActions, 'getMyWorkExperience')
      .mockImplementation(mockActionGetMyWorkEXP as any);

    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    const storeData = {...initialState};

    storeData.auth.user = user as any;
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: USER_PROFILE.id}}};

    const wrapper = renderWithRedux(<UserEditProfile {...props} />, store);

    const buttonEdit = wrapper.getByTestId('user_edit_profile.basic_info.edit');
    expect(buttonEdit).toBeDefined();
    fireEvent.press(buttonEdit);

    expect(navigate).toBeCalledWith(mainStack.editBasicInfo);
  });

  it(`should navigate to screen edit contact when click edit contact`, async () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_MY_PROFILE,
        payload: USER_PROFILE,
      };
    };
    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);

    const mockActionGetMyWorkEXP = () => {
      return {
        type: menuTypes.SET_MY_WORK_EXPERIENCE,
        payload: WORK_EXPERIENCE,
      };
    };

    jest
      .spyOn(menuActions, 'getMyWorkExperience')
      .mockImplementation(mockActionGetMyWorkEXP as any);

    const storeData = {...initialState};
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: USER_PROFILE.id}}};

    const wrapper = renderWithRedux(<UserEditProfile {...props} />, store);

    const buttonEdit = wrapper.getByTestId('user_edit_profile.contact.edit');
    expect(buttonEdit).toBeDefined();
    fireEvent.press(buttonEdit);

    expect(navigate).toBeCalledWith(mainStack.editContact);
  });

  it(`should navigate to screen edit work experience when click edit work experience`, async () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_MY_PROFILE,
        payload: USER_PROFILE,
      };
    };
    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);

    const mockActionGetMyWorkEXP = () => {
      return {
        type: menuTypes.SET_MY_WORK_EXPERIENCE,
        payload: WORK_EXPERIENCE,
      };
    };

    jest
      .spyOn(menuActions, 'getMyWorkExperience')
      .mockImplementation(mockActionGetMyWorkEXP as any);

    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    const storeData = {...initialState};

    storeData.auth.user = user as any;
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: USER_PROFILE.id}}};

    const wrapper = renderWithRedux(<UserEditProfile {...props} />, store);

    const listWorkExp = wrapper.queryAllByTestId('user_edit_profile.work.item');
    expect(listWorkExp.length).toBeGreaterThan(0);
    fireEvent.press(listWorkExp[0]);

    expect(navigate).toBeCalledWith(mainStack.addWork);
  });

  it(`should navigate to screen add work experience when click add work experience`, async () => {
    const navigate = jest.fn();
    const rootNavigation = {navigate};

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => {
      return {rootNavigation} as any;
    });

    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_MY_PROFILE,
        payload: USER_PROFILE,
      };
    };
    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);

    const mockActionGetMyWorkEXP = () => {
      return {
        type: menuTypes.SET_MY_WORK_EXPERIENCE,
        payload: WORK_EXPERIENCE,
      };
    };

    jest
      .spyOn(menuActions, 'getMyWorkExperience')
      .mockImplementation(mockActionGetMyWorkEXP as any);

    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    const storeData = {...initialState};

    storeData.auth.user = user as any;
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;

    const store = mockStore(storeData);
    const props = {route: {params: {userId: USER_PROFILE.id}}};

    const wrapper = renderWithRedux(<UserEditProfile {...props} />, store);

    const addWorkButton = wrapper.getByTestId(
      'user_edit_profile.work.add_work',
    );
    expect(addWorkButton).toBeDefined();
    fireEvent.press(addWorkButton);

    expect(navigate).toBeCalledWith(mainStack.addWork);
  });

  it(`should checkPermission when click edit avatar`, async () => {
    const user = {
      signInUserSession: {
        idToken: {payload: {'custom:bein_user_id': USER_PROFILE.id}},
      },
    };
    const storeData = {...initialState};

    storeData.auth.user = user as any;
    //@ts-ignore
    storeData.menu.myProfile = USER_PROFILE;

    const mockActionGetMyProfile = () => {
      return {
        type: menuTypes.SET_MY_PROFILE,
        payload: USER_PROFILE,
      };
    };

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);

    const mockActionGetMyWorkEXP = () => {
      return {
        type: menuTypes.SET_MY_WORK_EXPERIENCE,
        payload: [],
      };
    };

    jest
      .spyOn(menuActions, 'getMyWorkExperience')
      .mockImplementation(mockActionGetMyWorkEXP as any);

    const store = mockStore(storeData);
    const props = {route: {params: {userId: USER_PROFILE.id}}};

    const wrapper = renderWithRedux(<UserEditProfile {...props} />, store);

    const buttonEdit = wrapper.getByTestId('user_edit_profile.avatar.edit');
    expect(buttonEdit).toBeDefined();
    fireEvent.press(buttonEdit);
  });
});
