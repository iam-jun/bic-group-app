import * as React from 'react';
import { Auth } from 'aws-amplify';
import { cleanup, fireEvent } from '@testing-library/react-native';
import CodeInputView from '.';
import {
  renderWithRedux,
} from '~/test/testUtils';
import i18n from '~/localization';

afterEach(cleanup);

describe('CodeInputView component', () => {
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
      errors: {},
    },
    watch: () => jest.fn(),
  };

  const email = 'thuquyen@tgm.vn';
  const code = '123456';
  const newPassword = '12345678';
  const confirmPassword = '12345678';

  it('renders correctly', () => {
    const getValues = jest.fn().mockImplementation((input: string) => {
      switch (input) {
        case 'email':
          return email;
        default:
          return '';
      }
    });
    const newUseForm = { ...useForm, getValues };
    const wrapper = renderWithRedux(
      <CodeInputView useFormData={newUseForm} />,
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('should call api request forgot password when press text Resend code', async () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };

    const spyRequestResetPassword = jest.spyOn(Auth, 'forgotPassword').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const getValues = jest.fn().mockImplementation((input: string) => {
      switch (input) {
        case 'email':
          return email;
        default:
          return '';
      }
    });
    const newUseForm = { ...useForm, getValues };

    const wrapper = renderWithRedux(
      <CodeInputView useFormData={newUseForm} />,
    );

    const buttonResendCode = wrapper.getByTestId('forgot_password.button_resend_code');
    expect(buttonResendCode).toBeDefined();
    fireEvent.press(buttonResendCode);

    expect(spyRequestResetPassword).toBeCalled();
  });

  it('show error text when send an invalid code', async () => {
    const errorMessage = i18n.t('auth:text_err_wrong_code');
    const getValues = jest.fn().mockImplementation((input: string) => {
      switch (input) {
        case 'email':
          return email;
        case 'code':
          return code;
        case 'newPassword':
          return newPassword;
        case 'confirmPassword':
          return confirmPassword;
      }
    });
    const newUseForm = {
      ...useForm,
      getValues,
      formState: {
        errors: {
          code: {
            type: 'manual',
            message: errorMessage,
          },
        },
      },
    };

    const wrapper = renderWithRedux(
      <CodeInputView useFormData={newUseForm} />,
    );

    const errorText = wrapper.queryByTestId('text_input.text_helper');
    expect(errorText).toBeDefined();
    expect(errorText?.props?.children?.[0]).toBe(errorMessage);
  });

  it('should call api confirm change password when click button submit', async () => {
    const response = {
      code: 200,
      data: {},
      meta: {},
    };

    const spy = jest.spyOn(Auth, 'forgotPasswordSubmit').mockImplementation(
      () => Promise.resolve(response) as any,
    );

    const getValues = jest.fn().mockImplementation((input: string) => {
      switch (input) {
        case 'email':
          return email;
        case 'code':
          return code;
        case 'newPassword':
          return newPassword;
        case 'confirmPassword':
          return confirmPassword;
      }
    });
    const newUseForm = {
      ...useForm,
      getValues,
    };

    const wrapper = renderWithRedux(
      <CodeInputView useFormData={newUseForm} />,
    );

    const buttonSubmit = wrapper.queryByTestId('forgot_password.button_change_password');
    expect(buttonSubmit).toBeDefined();
    fireEvent.press(buttonSubmit);

    expect(spy).toBeCalled();
  });

  it('should show error text when code is greater than 7 letter', () => {
    const errorMessage = i18n.t('auth:text_err_password_characters');
    const getValues = jest.fn().mockImplementation((input: string) => {
      switch (input) {
        case 'email':
          return email;
        case 'code':
          return '012345678';
      }
    });
    const newUseForm = {
      ...useForm,
      getValues,
      formState: {
        errors: {
          code: {
            type: 'manual',
            message: errorMessage,
          },
        },
      },
    };

    const wrapper = renderWithRedux(
      <CodeInputView useFormData={newUseForm} />,
    );

    const codeInput = wrapper.queryByTestId('forgot_password.input_code');
    expect(codeInput).toBeDefined();
    fireEvent.changeText(codeInput, '012345678');

    const errorText = wrapper.queryByTestId('text_input.text_helper');
    expect(errorText).toBeDefined();
    expect(errorText?.props?.children?.[0]).toBe(errorMessage);
  });

  it('should show error text when confirm password is mismatch with new password', () => {
    const errorMessage = i18n.t('auth:text_err_confirm_password_not_matched');
    const getValues = jest.fn().mockImplementation((input: string) => {
      switch (input) {
        case 'email':
          return email;
        case 'newPassword':
          return newPassword;
        case 'confirmPassword':
          return '0123';
      }
    });
    const newUseForm = {
      ...useForm,
      getValues,
      formState: {
        errors: {
          code: {
            type: 'manual',
            message: errorMessage,
          },
        },
      },
    };

    const wrapper = renderWithRedux(
      <CodeInputView useFormData={newUseForm} />,
    );

    const newPasswordInput = wrapper.queryByTestId('forgot_password.input_new_password');
    expect(newPasswordInput).toBeDefined();
    fireEvent.changeText(newPasswordInput, newPassword);

    const confirmPasswordInput = wrapper.queryByTestId('forgot_password.input_confirm_password');
    expect(confirmPasswordInput).toBeDefined();
    fireEvent.changeText(confirmPasswordInput, '0123');

    const errorText = wrapper.queryByTestId('text_input.text_helper');
    expect(errorText).toBeDefined();
    expect(errorText?.props?.children?.[0]).toBe(errorMessage);
  });
});
