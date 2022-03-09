/* eslint-disable @typescript-eslint/no-var-requires */

import {cleanup, waitFor} from '@testing-library/react-native';
import React from 'react';
import {getUserFromSharedPreferences} from '~/services/sharePreferences';
import initialState from '~/store/initialState';
import {configureStore, fireEvent, renderWithRedux} from '~/test/testUtils';
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

  // it(`renders correctly`, async () => {
  //   const store = mockStore(initialState);

  //   const wrapper = renderWithRedux(<SignIn />, store);

  //   expect(wrapper.toJSON()).toMatchSnapshot();
  // });

  it(`should hide keyboard`, async () => {
    Platform.OS = 'ios';
    Keyboard.dismiss = jest.fn();
    const store = mockStore(initialState);
    const wrapper = renderWithRedux(<SignIn />, store);
    const component = wrapper.getByTestId('SignInScreen.button_hide_keyboard');
    fireEvent.press(component);

    expect(Keyboard.dismiss).toBeCalled();
  });

  it(`should not hide keyboard`, async () => {
    Platform.OS = 'web';
    Keyboard.dismiss = jest.fn();
    const store = mockStore(initialState);
    const wrapper = renderWithRedux(<SignIn />, store);
    const component = wrapper.getByTestId('SignInScreen.button_hide_keyboard');
    fireEvent.press(component);

    expect(Keyboard.dismiss).not.toBeCalled();
  });

  it(`should disable inputs when loading`, async () => {
    const store = mockStore({
      ...initialState,
      auth: {
        ...initialState.auth,
        loading: true,
      },
    });

    const wrapper = renderWithRedux(<SignIn />, store);
    const inputEmail = wrapper.getByTestId('SignInScreen.input_email');
    const inputPassword = wrapper.getByTestId('SignInScreen.input_password');

    expect(inputEmail.props.disabled).toBeTruthy();
    expect(inputPassword.props.disabled).toBeTruthy();
  });

  it(`should disable input email when has auth session`, async () => {
    //@ts-ignore
    getUserFromSharedPreferences.mockImplementation(() =>
      Promise.resolve({
        email: 'foo@bar.com',
      }),
    );

    const store = mockStore(initialState);
    const wrapper = await waitFor(() => renderWithRedux(<SignIn />, store));
    const inputEmail = wrapper.getByTestId('SignInScreen.input_email');

    expect(inputEmail.props.disabled).toBeTruthy();
  });

  it(`should show label`, async () => {
    const store = mockStore({
      ...initialState,
      auth: {
        ...initialState.auth,
        loading: false,
      },
    });
    Platform.OS = 'ios';

    const wrapper = renderWithRedux(<SignIn />, store);
    const inputEmail = wrapper.getByTestId('SignInScreen.input_email');
    const inputPassword = wrapper.getByTestId('SignInScreen.input_password');

    expect(inputEmail.props.label).toBe('Email Address');
    expect(inputPassword.props.label).toBe('Password');
  });

  it(`should hide label on web`, async () => {
    const store = mockStore(initialState);
    Platform.OS = 'web';

    const wrapper = renderWithRedux(<SignIn />, store);
    const inputEmail = wrapper.getByTestId('SignInScreen.input_email');
    const inputPassword = wrapper.getByTestId('SignInScreen.input_password');

    expect(inputEmail.props.label).toBe(undefined);
    expect(inputPassword.props.label).toBe(undefined);
  });

  it(`should show sample email placeholder on mobile`, async () => {
    const store = mockStore(initialState);
    Platform.OS = 'ios';

    const wrapper = renderWithRedux(<SignIn />, store);
    const inputEmail = wrapper.getByTestId('SignInScreen.input_email');

    expect(inputEmail.props.placeholder).toBe('sample@email.com');
  });

  it(`should show placeholder the same label on web`, async () => {
    const store = mockStore(initialState);
    Platform.OS = 'web';

    const wrapper = renderWithRedux(<SignIn />, store);
    const inputEmail = wrapper.getByTestId('SignInScreen.input_email');

    expect(inputEmail.props.placeholder).toBe('Email Address');
  });

  it(`Login button should be clickable`, async () => {
    const store = mockStore(initialState);

    const wrapper = await waitFor(() => renderWithRedux(<SignIn />, store));
    const buttonLogin = wrapper.getByTestId('SignInScreen.btn_login');
    const inputEmail = wrapper.getByTestId('SignInScreen.input_email');
    const inputPassword = wrapper.getByTestId('SignInScreen.input_password');

    fireEvent.changeText(inputEmail, 'email@domain.com');
    fireEvent.changeText(inputPassword, '12345678');
    expect(buttonLogin.props.disabled).toBeFalsy();
  });

  it(`should disable inputs when loading`, async () => {
    const store = mockStore({
      ...initialState,
      auth: {
        ...initialState.auth,
        loading: true,
      },
    });
    const wrapper = renderWithRedux(<SignIn />, store);
    const loadingIndicator = wrapper.getByTestId('SignInScreen.loading');

    expect(loadingIndicator).not.toBeNull();
  });

  //   it(`should show error`, async () => {
  //     const store = mockStore({
  //       ...initialState,
  //       // auth: {
  //       //   ...initialState.auth,
  //       //   signingInError: 'signingInError',
  //       // },
  //     });

  //     useForm = jest.fn().mockReturnValue({
  //       formState: {
  //         errors: {
  //           email: {
  //             type: 'validate',
  //             message: 'signingInError',
  //           },
  //           password: {
  //             type: 'validate',
  //             message: 'signingInError',
  //           },
  //         },
  //       },
  //     });

  //     const wrapper = renderWithRedux(<SignIn />, store);
  //     const inputEmail = wrapper.getByTestId('SignInScreen.input_email');
  //     const inputPassword = wrapper.getByTestId('SignInScreen.input_password');
  //     // const buttonLogin = wrapper.getByTestId('SignInScreen.btn_login');

  //     // fireEvent.changeText(inputEmail, 'email');
  //     // fireEvent.changeText(inputPassword, '1234');

  //     // await waitFor(() => fireEvent.press(buttonLogin));

  //     // expect(inputEmail.props.helperContent).toBe('signingInError');
  //     expect(inputEmail.props.helperType).toBe('error');
  //     expect(inputPassword.props.helperType).toBe('error');
  //   });
});
