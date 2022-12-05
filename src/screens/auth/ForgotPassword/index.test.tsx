/* eslint-disable @typescript-eslint/no-var-requires */

import { cleanup } from '@testing-library/react-native';

import React from 'react';

import {
  fireEvent, renderHook, renderWithRedux, act,
} from '~/test/testUtils';

import ForgotPassword from '.';
import * as navigationHook from '~/hooks/navigation';
import useForgotPasswordStore from './store';
import { forgotPasswordStages } from '~/constants/authConstants';

afterEach(cleanup);

describe('ForgotPassword screen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show only ForgotInputId component and custom back button when open screen', () => {
    const wrapper = renderWithRedux(<ForgotPassword />);

    const requireEmailComponent = wrapper.getByTestId('forgot_password.require_email');
    expect(requireEmailComponent).toBeDefined();

    const buttonBack = wrapper.getByTestId('forgot_password.button_back');
    expect(buttonBack).toBeDefined();

    const completeComponent = wrapper.queryByTestId('forgot_password.complete_view');
    expect(completeComponent).toBeNull();
  });

  it('should back to SignIn screen when click button back custom', () => {
    const goBack = jest.fn();
    const rootNavigation = { canGoBack: true, goBack };

    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    const wrapper = renderWithRedux(<ForgotPassword />);

    const requireEmailComponent = wrapper.getByTestId('forgot_password.require_email');
    expect(requireEmailComponent).toBeDefined();

    const buttonBack = wrapper.getByTestId('forgot_password.button_back');
    expect(buttonBack).toBeDefined();

    const completeComponent = wrapper.queryByTestId('forgot_password.complete_view');
    expect(completeComponent).toBeNull();

    fireEvent.press(buttonBack);
    expect(goBack).toBeCalled();
  });

  it('should show only CodeInputView component and custom back button when forgotPasswordStage = INPUT_CODE_PW',
    () => {
      const { result } = renderHook(() => useForgotPasswordStore());

      const wrapper = renderWithRedux(<ForgotPassword />);

      act(() => {
        result.current.actions.setScreenCurrentStage(forgotPasswordStages.INPUT_CODE_PW);
      });

      const confirmComponent = wrapper.queryByTestId('forgot_password.confirm_view');
      expect(confirmComponent).toBeDefined();

      const buttonBack = wrapper.getByTestId('forgot_password.button_back');
      expect(buttonBack).toBeDefined();

      const completeComponent = wrapper.queryByTestId('forgot_password.complete_view');
      expect(completeComponent).toBeNull();

      const requireEmailComponent = wrapper.queryByTestId('forgot_password.require_email');
      expect(requireEmailComponent).toBeNull();
    });

  it('should show only complete screen and hide custom back button when forgotPasswordStage = COMPLETE',
    () => {
      const { result } = renderHook(() => useForgotPasswordStore());

      const wrapper = renderWithRedux(<ForgotPassword />);

      act(() => {
        result.current.actions.setScreenCurrentStage(forgotPasswordStages.COMPLETE);
      });

      const requireEmailComponent = wrapper.queryByTestId('forgot_password.require_email');
      expect(requireEmailComponent).toBeNull();

      const buttonBack = wrapper.queryByTestId('forgot_password.button_back');
      expect(buttonBack).toBeNull();

      const confirmComponent = wrapper.queryByTestId('forgot_password.confirm_view');
      expect(confirmComponent).toBeNull();

      const completeComponent = wrapper.queryByTestId('forgot_password.complete_view');
      expect(completeComponent).toBeDefined();
    });

  it('should goback when click button Sign in now',
    () => {
      const navigate = jest.fn();
      const goBack = jest.fn();
      const rootNavigation = { navigate, goBack };
      jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

      const { result } = renderHook(() => useForgotPasswordStore());

      const wrapper = renderWithRedux(<ForgotPassword />);

      act(() => {
        result.current.actions.setScreenCurrentStage(forgotPasswordStages.COMPLETE);
      });

      const requireEmailComponent = wrapper.queryByTestId('forgot_password.require_email');
      expect(requireEmailComponent).toBeNull();

      const buttonBack = wrapper.queryByTestId('forgot_password.button_back');
      expect(buttonBack).toBeNull();

      const confirmComponent = wrapper.queryByTestId('forgot_password.confirm_view');
      expect(confirmComponent).toBeNull();

      const completeComponent = wrapper.queryByTestId('forgot_password.complete_view');
      expect(completeComponent).toBeDefined();

      const buttonSignInNow = wrapper.queryByTestId('forgot_password.button_complete');
      expect(buttonSignInNow).toBeDefined();
      fireEvent.press(buttonSignInNow);

      expect(goBack).toBeCalled();
    });
});
