import * as React from 'react';
import { Auth } from 'aws-amplify';
import { cleanup } from '@testing-library/react-native';
import EmailInputView from '.';
import {
  renderWithRedux,
  fireEvent,
} from '~/test/testUtils';
import i18n from '~/localization';

afterEach(cleanup);

describe('EmailInputView component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const useForm = {
    setError: jest.fn(),
    clearErrors: jest.fn(),
    trigger: jest.fn(),

    handleSubmit: () => jest.fn(),
    control: {
      register: jest.fn(),
      unregister: jest.fn(),
      getFieldState: jest.fn(),
      _names: {
        array: new Set('test'),
        mount: new Set('test'),
        unMount: new Set('test'),
        watch: new Set('test'),
        focus: 'test',
        watchAll: false,
      },
      _subjects: {
        watch: jest.fn(),
        array: jest.fn(),
        state: jest.fn(),
      },
      _getWatch: jest.fn(),
      _formValues: ['test'],
      _defaultValues: ['test'],
    },
    getValues: () => '',
    setValue: () => jest.fn(),
    formState: {
      errors: {
      },
    },
    watch: () => jest.fn(),
  };

  it('renders correctly', () => {
    const wrapper = renderWithRedux(
      <EmailInputView useFormData={useForm} />,
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('disable button send code to email when typing an invalid email', async () => {
    const wrapper = renderWithRedux(<EmailInputView useFormData={useForm} />);

    const textInputComponent = wrapper.getByTestId('forgot_password.input_email');
    expect(textInputComponent).toBeDefined();
    fireEvent.changeText(textInputComponent, 'y');

    const buttonSend = wrapper.getByTestId('forgot_password.button_send');
    expect(buttonSend).toBeDefined();
    expect(buttonSend.props?.accessibilityState?.disabled).toBe(true);
  });

  it('request code to forgot password with valid email', async () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };

    const spyRequestResetPassword = jest.spyOn(Auth, 'forgotPassword').mockImplementation(
      () => Promise.resolve(response) as any,
    );
    const email = 'thuquyen@tgm.vn';
    const getValues = jest.fn().mockImplementation((input: string) => {
      switch (input) {
        case 'email':
          return email;
        default:
          return '';
      }
    });
    const setValue = jest.fn();
    const clearErrors = jest.fn();
    const newUseForm = {
      ...useForm,
      getValues,
      setValue,
      clearErrors,
      formState: {
        errors: {},
      },
    };

    const wrapper = renderWithRedux(<EmailInputView useFormData={newUseForm} />);

    const textInputComponent = wrapper.getByTestId('forgot_password.input_email');
    expect(textInputComponent).toBeDefined();
    fireEvent.changeText(textInputComponent, email);

    const buttonSend = wrapper.getByTestId('forgot_password.button_send');
    expect(buttonSend).toBeDefined();
    expect(buttonSend.props?.accessibilityState?.disabled).toBe(false);

    fireEvent.press(buttonSend);

    expect(spyRequestResetPassword).toBeCalledWith(email);
  });

  it('request code to forgot password with valid email but error', () => {
    const errorMessage = i18n.t('auth:text_forgot_password_email_not_found');
    const newUseForm = {
      ...useForm,
      formState: {
        errors: {
          email: {
            type: 'manual',
            message: errorMessage,
          },
        },
      },
    };

    const wrapper = renderWithRedux(<EmailInputView useFormData={newUseForm} />);

    const buttonSend = wrapper.getByTestId('forgot_password.button_send');
    expect(buttonSend).toBeDefined();
    expect(buttonSend.props?.accessibilityState?.disabled).toBe(true);

    const errorText = wrapper.queryByTestId('text_input.text_helper');
    expect(errorText).toBeDefined();
    expect(errorText?.props?.children?.[0]).toBe(errorMessage);
  });
});
