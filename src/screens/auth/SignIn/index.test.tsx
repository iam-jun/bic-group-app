/**
 * @jest-environment jsdom
 */

import { cleanup, waitFor } from '@testing-library/react-native';
import React from 'react';

import initialState from '~/storeRedux/initialState';
import { configureStore, fireEvent, renderWithRedux } from '~/test/testUtils';
import SignIn from '.';

afterEach(cleanup);

describe('SignIn screen', () => {
  let Platform: any;
  let Keyboard: any;

  const mockStore = configureStore([]);

  beforeEach(() => {
    Platform = require('react-native').Platform;
    Keyboard = require('react-native').Keyboard;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hide keyboard', async () => {
    Platform.OS = 'ios';
    Keyboard.dismiss = jest.fn();
    const store = mockStore(initialState);
    const wrapper = renderWithRedux(<SignIn />, store);
    const component = wrapper.getByTestId('sign_in.button_hide_keyboard');
    fireEvent.press(component);

    expect(Keyboard.dismiss).toBeCalled();
  });

  it('should show sample email placeholder on mobile', async () => {
    const store = mockStore(initialState);
    Platform.OS = 'ios';

    const wrapper = renderWithRedux(<SignIn />, store);
    const inputEmail = wrapper.getByTestId('sign_in.input_email');

    expect(inputEmail.props.placeholder).toBe('example@gmail.com');
  });

  it('Login button should be clickable', async () => {
    const store = mockStore(initialState);

    const wrapper = await waitFor(() => renderWithRedux(<SignIn />, store));
    const buttonLogin = wrapper.getByTestId('sign_in.btn_login');
    const inputEmail = wrapper.getByTestId('sign_in.input_email');
    const inputPassword = wrapper.getByTestId('sign_in.input_password');

    fireEvent.changeText(inputEmail, 'email@domain.com');
    fireEvent.changeText(inputPassword, '12345678');
    expect(buttonLogin.props.disabled).toBeFalsy();
  });
});
