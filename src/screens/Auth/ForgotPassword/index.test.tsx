/* eslint-disable @typescript-eslint/no-var-requires */

import { cleanup } from '@testing-library/react-native';

import React from 'react';

import initialState from '~/store/initialState';

import { createTestStore, fireEvent, renderWithRedux } from '~/test/testUtils';

import ForgotPassword from '.';
import { forgotPasswordStages } from '~/constants/authConstants';
import actions from '~/screens/Auth/redux/actions';
import types from '~/screens/Auth/redux/types';
import * as navigationHook from '~/hooks/navigation';

afterEach(cleanup);

describe('ForgotPassword screen', () => {
  let Keyboard: any;

  beforeEach(() => {
    Keyboard = require('react-native').Keyboard;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show only ForgotInputId and custom back button when open screen', async () => {
    const mockActionSetForgotPasswordStage = () => ({
      type: types.SET_FORGOT_PASSWORD_STAGE,
      payload: forgotPasswordStages.INPUT_ID,
    });

    jest
      .spyOn(actions, 'setForgotPasswordStage')
      .mockImplementation(mockActionSetForgotPasswordStage as any);

    const forgotPasswordError = {
      errBox: '',
      errRequest: '',
      errConfirm: '',
    };
    const storeData = { ...initialState };

    storeData.auth.forgotPasswordStage = '';
    storeData.auth.forgotPasswordLoading = false;
    storeData.auth.forgotPasswordError = forgotPasswordError as any;
    const store = createTestStore(initialState);

    const wrapper = renderWithRedux(<ForgotPassword />, store);

    const inputEmail = wrapper.getByTestId('inputEmail');
    expect(inputEmail).toBeDefined();

    const btnBack = wrapper.getByTestId('forgot_button.back');
    expect(btnBack).toBeDefined();

    const btnComplete = wrapper.queryByTestId('btnComplete');
    expect(btnComplete).toBeNull();

    const inputCode = wrapper.queryByTestId('inputCode');
    expect(inputCode).toBeNull();
  });

  it('should back to SignIn screen when click button back custom', async () => {
    const mockActionSetForgotPasswordStage = () => ({
      type: types.SET_FORGOT_PASSWORD_STAGE,
      payload: forgotPasswordStages.INPUT_ID,
    });

    jest
      .spyOn(actions, 'setForgotPasswordStage')
      .mockImplementation(mockActionSetForgotPasswordStage as any);

    const goBack = jest.fn();

    const rootNavigation = { canGoBack: true, goBack };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const forgotPasswordError = {
      errBox: '',
      errRequest: '',
      errConfirm: '',
    };
    const storeData = { ...initialState };

    storeData.auth.forgotPasswordStage = '';
    storeData.auth.forgotPasswordLoading = false;
    storeData.auth.forgotPasswordError = forgotPasswordError as any;
    const store = createTestStore(initialState);

    const wrapper = renderWithRedux(<ForgotPassword />, store);

    const inputEmail = wrapper.getByTestId('inputEmail');
    expect(inputEmail).toBeDefined();

    const btnBack = wrapper.getByTestId('forgot_button.back');
    expect(btnBack).toBeDefined();

    const btnComplete = wrapper.queryByTestId('btnComplete');
    expect(btnComplete).toBeNull();

    const inputCode = wrapper.queryByTestId('inputCode');
    expect(inputCode).toBeNull();

    fireEvent.press(btnBack);
    expect(goBack).toBeCalled();
  });

  it('should show only ForgotInputCodePw and custom back button when forgotPasswordStage = INPUT_CODE_PW', async () => {
    const mockActionSetForgotPasswordStage = () => ({
      type: types.SET_FORGOT_PASSWORD_STAGE,
      payload: forgotPasswordStages.INPUT_CODE_PW,
    });

    jest
      .spyOn(actions, 'setForgotPasswordStage')
      .mockImplementation(mockActionSetForgotPasswordStage as any);

    const goBack = jest.fn();

    const rootNavigation = { canGoBack: true, goBack };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const forgotPasswordError = {
      errBox: '',
      errRequest: '',
      errConfirm: '',
    };
    const storeData = { ...initialState };

    storeData.auth.forgotPasswordStage = '';
    storeData.auth.forgotPasswordLoading = false;
    storeData.auth.forgotPasswordError = forgotPasswordError as any;
    const store = createTestStore(initialState);

    const wrapper = renderWithRedux(<ForgotPassword />, store);

    const inputEmail = wrapper.queryByTestId('inputEmail');
    expect(inputEmail).toBeNull();

    const btnBack = wrapper.getByTestId('forgot_button.back');
    expect(btnBack).toBeDefined();

    const btnComplete = wrapper.queryByTestId('btnComplete');
    expect(btnComplete).toBeNull();

    const inputCode = wrapper.queryByTestId('inputCode');
    expect(inputCode).toBeDefined();
  });

  it('should show only complete screen and hide custom back button when forgotPasswordStage = COMPLETE', async () => {
    const mockActionSetForgotPasswordStage = () => ({
      type: types.SET_FORGOT_PASSWORD_STAGE,
      payload: forgotPasswordStages.COMPLETE,
    });

    jest
      .spyOn(actions, 'setForgotPasswordStage')
      .mockImplementation(mockActionSetForgotPasswordStage as any);

    const forgotPasswordError = {
      errBox: '',
      errRequest: '',
      errConfirm: '',
    };
    const storeData = { ...initialState };

    storeData.auth.forgotPasswordStage = '';
    storeData.auth.forgotPasswordLoading = false;
    storeData.auth.forgotPasswordError = forgotPasswordError as any;
    const store = createTestStore(initialState);

    const wrapper = renderWithRedux(<ForgotPassword />, store);

    const inputEmail = wrapper.queryByTestId('inputEmail');
    expect(inputEmail).toBeNull();

    const btnBack = wrapper.queryByTestId('forgot_button.back');
    expect(btnBack).toBeNull();

    const inputCode = wrapper.queryByTestId('inputCode');
    expect(inputCode).toBeDefined();

    const btnComplete = wrapper.queryByTestId('btnComplete');
    expect(btnComplete).toBeDefined();
  });
});
