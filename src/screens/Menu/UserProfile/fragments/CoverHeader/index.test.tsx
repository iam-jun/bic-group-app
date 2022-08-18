/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';
import initialState from '~/storeRedux/initialState';
import {
  cleanup,
  act,
  configureStore,
  createTestStore,
  renderWithRedux,
  fireEvent,
} from '~/test/testUtils';
import CoverHeader from '.';
import { USER_PROFILE } from '~/test/mock_data/menu';
import menuTypes from '../../../../../storeRedux/menu/types';
import menuActions from '../../../../../storeRedux/menu/actions';
import * as helper from '../../helper';
import * as dimension from '~/theme/dimension';

afterEach(cleanup);

describe('CoverHeader screen', () => {
  const mockStore = configureStore([]);
  let storeData: any;
  const baseProps = {
    id: '1',
    userId: '1',
    currentUsername: 'username',
    bgImg: null,
    avatar: null,
    coverHeight: 120,
    uploadCallback: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks();
    storeData = { ...initialState };
    storeData.menu.myProfile = {} as any;
    storeData.auth.user = {} as any;
  });

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

    const wrapper = renderWithRedux(<CoverHeader {...baseProps} />, store);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call _openImagePicker 2 times', () => {
    const spy = jest.spyOn(helper, '_openImagePicker');

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
    const props = { ...baseProps, userId: USER_PROFILE.id }
    const store = createTestStore(storeData);
    const wrapper = renderWithRedux(<CoverHeader {...props} />, store);

    const buttonEditCover = wrapper.queryByTestId('user_profile.cover_image.edit_button');
    expect(buttonEditCover).toBeDefined();

    const buttonEditAvatar = wrapper.queryByTestId('user_profile.avatar_image.edit_button');
    expect(buttonEditAvatar).toBeDefined();

    fireEvent.press(buttonEditCover);
    fireEvent.press(buttonEditAvatar);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should not call scaleCoverHeight when layout event width is null', () => {
    const spy = jest.spyOn(dimension, 'scaleCoverHeight');

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

    const { getByTestId } = renderWithRedux(<CoverHeader {...baseProps} />, store);
    const coverHeader = getByTestId('user_profile.cover_header');

    act(() => {
      fireEvent(coverHeader, 'layout', {
        nativeEvent: { layout: { width: null } },
      });
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call scaleCoverHeight when layout event width is number', () => {
    const spy = jest.spyOn(dimension, 'scaleCoverHeight');

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

    const { getByTestId } = renderWithRedux(<CoverHeader {...baseProps} />, store);
    const coverHeader = getByTestId('user_profile.cover_header');

    act(() => {
      fireEvent(coverHeader, 'layout', {
        nativeEvent: { layout: { width: 120 } },
      });
    });

    expect(spy).toHaveBeenCalled();
  });
});
