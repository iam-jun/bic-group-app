import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { act } from 'react-test-renderer';
import MockedNavigator from '~/test/MockedNavigator';

import { fireEvent, render } from '~/test/testUtils';
import SignUp from './index';
import useAuthController from '../store';

type NativeStackNavigationPropAlias = NativeStackNavigationProp<{}>;

jest.mock('react-hook-form', () => ({
  ...(jest.requireActual('react-hook-form') as object),
}));

describe('SignUp component', () => {
  let navigation: Partial<NativeStackNavigationPropAlias>;

  it('renders correctly', async () => {
    const signUp = jest.fn();
    useAuthController.setState((state) => {
      state.actions.signUp = signUp;
      return state;
    });
    const baseProps = { route: { params: { isValidLink: true, referralCode: 'abc' } } };
    const rendered = render(
      <MockedNavigator
        component={() => <SignUp {...baseProps} navigation={navigation as NativeStackNavigationPropAlias} />}
      />,
    );
    expect(rendered.toJSON()).toMatchSnapshot();

    const { getByTestId } = rendered;
    const containerComponent = getByTestId('sign_up');
    expect(containerComponent).toBeDefined();

    const inputEmail = getByTestId('input_email');
    const inputFullName = getByTestId('input_full_name');
    const inputUserName = getByTestId('input_user_name');
    const inputPassword = getByTestId('form_check_password.input');
    const checkbox = getByTestId('sign_up.checkbox');

    fireEvent.press(checkbox);
    await act(async () => {
      fireEvent.changeText(inputEmail, 'test@gmail.com');
      fireEvent.changeText(inputFullName, 'Nguyen Van A');
      fireEvent.changeText(inputUserName, 'test123');
      fireEvent.changeText(inputPassword, '12345678@Aa');
    });

    const btnSignUp = getByTestId('sign_up.btn_sign_up');
    fireEvent.press(btnSignUp);
    expect(signUp).toBeCalled();
  });

  it('renders LoadingIndicator', () => {
    const baseProps = { route: { params: { isValidLink: false } } };
    useAuthController.setState((state) => {
      state.signUp = { loading: true, error: '' };
      return state;
    });
    const rendered = render(
      <MockedNavigator
        component={() => <SignUp {...baseProps} navigation={navigation as NativeStackNavigationPropAlias} />}
      />,
    );

    const { getByTestId } = rendered;
    const loadingView = getByTestId('sign_in.loading');
    expect(loadingView).toBeDefined();
    const errorText = getByTestId('sign_up.error_link');
    expect(errorText).toBeDefined();
  });
});
