import React from 'react';
import { Auth } from 'aws-amplify';
import MockedNavigator from '~/test/MockedNavigator';

import {
  act,
  fireEvent,
  renderWithRedux,
} from '~/test/testUtils';
import ConfirmUser from './ConfirmUser';
import useVerifyEmailController from './store';
import i18n from '~/localization';
import * as navigationHook from '~/hooks/navigation';
import authStacks from '~/router/navigator/AuthStack/stack';

describe('RequestVerifyEmailModal Component', () => {
  const props = {
    route: {
      params: {
        params: {
          confirmationCode: '12345',
          redirectTo: 'login',
          userName: 'test@evol.vn',
        },
      },
    },
  };

  it('should render loading view when loading = true', () => {
    Auth.confirmSignUp = jest.fn();

    act(() => {
      useVerifyEmailController.getState().actions.setLoadingConfirmSignUp(true);
    });

    const rendered = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ConfirmUser
            {...props}
          />
        )}
      />,
    );

    const textComponent = rendered.getByTestId('confirm_user.text');
    expect(textComponent).toBeDefined();
    expect(textComponent.children?.[0]).toBe(i18n.t('common:text_loading'));
  });

  it('should render expired view when linkExpired = true', () => {
    Auth.confirmSignUp = jest.fn().mockImplementation(() => new Promise((_resolve, reject) => {
      reject({
        name: 'NotAuthorizedException',
        code: 'NotAuthorizedException',
      });
    }));
    jest.useFakeTimers();
    act(() => {
      useVerifyEmailController.getState().actions.setLinkIsExpired(true);
      useVerifyEmailController.getState().actions.setLoadingConfirmSignUp(false);
    });

    const rendered = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ConfirmUser
            {...props}
          />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });
    expect(Auth.confirmSignUp).toBeCalled();

    const textComponent = rendered.getByTestId('confirm_user.text');
    expect(textComponent).toBeDefined();
    expect(textComponent.children?.[0]).toBe(i18n.t('auth:verify_email_expired'));
  });

  it('should render verified successfuly view when linkExpired = false and loading = false', () => {
    Auth.confirmSignUp = jest.fn();
    jest.useFakeTimers();

    act(() => {
      useVerifyEmailController.getState().actions.setLinkIsExpired(false);
      useVerifyEmailController.getState().actions.setLoadingConfirmSignUp(false);
    });

    const rendered = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ConfirmUser
            {...props}
          />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });
    expect(Auth.confirmSignUp).toBeCalled();

    const textComponent = rendered.getByTestId('confirm_user.text');
    expect(textComponent).toBeDefined();
    expect(textComponent.children?.[0]).toBe(i18n.t('auth:verify_email_success'));

    const buttonComponent = rendered.getByTestId('confirm_user.button');
    expect(buttonComponent).toBeDefined();
  });

  it('should replace to signIn screen when redirectTo = login', () => {
    const replace = jest.fn();
    const rootNavigation = { replace };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    Auth.confirmSignUp = jest.fn();
    jest.useFakeTimers();

    act(() => {
      useVerifyEmailController.getState().actions.setLinkIsExpired(false);
      useVerifyEmailController.getState().actions.setLoadingConfirmSignUp(false);
    });

    const rendered = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ConfirmUser
            {...props}
          />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });
    expect(Auth.confirmSignUp).toBeCalled();

    const textComponent = rendered.getByTestId('confirm_user.text');
    expect(textComponent).toBeDefined();
    expect(textComponent.children?.[0]).toBe(i18n.t('auth:verify_email_success'));

    const buttonComponent = rendered.getByTestId('confirm_user.button');
    expect(buttonComponent).toBeDefined();

    fireEvent.press(buttonComponent);
    expect(replace).toBeCalledWith(authStacks.signIn);
  });

  it('should replace to forgot password screen when redirectTo = reset-password', () => {
    const props1 = {
      route: {
        params: {
          params: {
            confirmationCode: '12345',
            redirectTo: 'reset-password',
            userName: 'test@evol.vn',
          },
        },
      },
    };

    const replace = jest.fn();
    const rootNavigation = { replace };
    jest.spyOn(navigationHook, 'useRootNavigation').mockImplementation(() => ({ rootNavigation } as any));

    Auth.confirmSignUp = jest.fn();
    jest.useFakeTimers();

    act(() => {
      useVerifyEmailController.getState().actions.setLinkIsExpired(false);
      useVerifyEmailController.getState().actions.setLoadingConfirmSignUp(false);
    });

    const rendered = renderWithRedux(
      <MockedNavigator
        component={() => (
          <ConfirmUser
            {...props1}
          />
        )}
      />,
    );

    act(() => {
      jest.runAllTimers();
    });
    expect(Auth.confirmSignUp).toBeCalled();

    const textComponent = rendered.getByTestId('confirm_user.text');
    expect(textComponent).toBeDefined();
    expect(textComponent.children?.[0]).toBe(i18n.t('auth:verify_email_success'));

    const buttonComponent = rendered.getByTestId('confirm_user.button');
    expect(buttonComponent).toBeDefined();

    fireEvent.press(buttonComponent);
    expect(replace).toBeCalledWith(authStacks.forgotPassword);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // you must add this
    jest.useRealTimers(); // you must add this
  });
});
