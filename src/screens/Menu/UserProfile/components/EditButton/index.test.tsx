import { cleanup } from '@testing-library/react-native';
import React from 'react';
import menuActions from '~/screens/Menu/redux/actions';
import menuTypes from '~/screens/Menu/redux/types';
import initialState from '~/store/initialState';
import { USER_PROFILE } from '~/test/mock_data/menu';
import { createTestStore, renderWithRedux } from '~/test/testUtils';
import EditButton from '.';

afterEach(cleanup);

describe('EditButton screen', () => {
  const baseProps = {
    userId: USER_PROFILE.id,
    currentUsername: 'username',
    onPress: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = { ...initialState };
    storeData.menu.myProfile = {} as any;
    storeData.auth.user = {} as any;
    storeData.menu.showUserNotFound = false;
    storeData.menu.loadingUserProfile = false;
  });

  let storeData: any;

  it('renders correctly', () => {
    const mockActionGetMyProfile = () => ({
      type: menuTypes.SET_USER_PROFILE,
      payload: USER_PROFILE,
    });

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);
    const user = {
      signInUserSession: {
        idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
      },
    };

    storeData.menu.myProfile = USER_PROFILE as any;
    storeData.auth.user = user as any;

    const store = createTestStore(storeData);

    const wrapper = renderWithRedux(<EditButton {...baseProps} />, store);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders null', () => {
    const mockActionGetMyProfile = () => ({
      type: menuTypes.SET_USER_PROFILE,
      payload: USER_PROFILE,
    });

    jest
      .spyOn(menuActions, 'getUserProfile')
      .mockImplementation(mockActionGetMyProfile as any);
    const user = {
      signInUserSession: {
        idToken: { payload: { 'custom:user_uuid': USER_PROFILE.id } },
      },
    };

    storeData.menu.myProfile = USER_PROFILE as any;
    storeData.auth.user = user as any;

    const store = createTestStore(storeData);

    const props = { ...baseProps, userId: '1' }

    const wrapper = renderWithRedux(<EditButton {...props} />, store);
    expect(wrapper).toMatchSnapshot();
  })
});
