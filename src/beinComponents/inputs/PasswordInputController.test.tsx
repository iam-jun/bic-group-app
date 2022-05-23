import * as React from 'react';
import {cleanup, render, fireEvent} from '@testing-library/react-native';
import PasswordInputController from './PasswordInputController';
import i18next from 'i18next';
import * as validation from '~/constants/commonRegex';

afterEach(cleanup);

describe('PasswordInputController component', () => {
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
    getValues: () => {
      return '';
    },
    setValue: () => jest.fn(),
    formState: {
      errors: {
        newPassword: {
          type: 'validate',
          message: 'signingInError',
        },
      },
    },
    watch: () => jest.fn(),
  };

  it(`renders correctly`, () => {
    const validateNewPassword = jest.fn();

    const wrapper = render(
      <PasswordInputController
        useFormData={useForm}
        name={'newPassword'}
        rules={{
          required: i18next.t('auth:text_err_password_blank'),
          pattern: {
            value: validation.passwordRegex,
            message: i18next.t('auth:text_err_password_format'),
          },
        }}
        loading={false}
        disableInput={false}
        testID={'inputNewPassword'}
        label={i18next.t('auth:input_label_new_password')}
        placeholder={i18next.t('auth:input_label_new_password')}
        validateValue={validateNewPassword}
      />,
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it(`should called validateValue and show error text when typing an invalid value by rule`, async () => {
    const newUseForm = {
      ...useForm,
      formState: {
        errors: {
          newPassword: {
            type: 'validate',
            message: i18next.t('auth:text_err_password_format'),
          },
        },
      },
    };
    const validateNewPassword = jest.fn();

    const wrapper = render(
      <PasswordInputController
        useFormData={newUseForm}
        name={'newPassword'}
        rules={{
          required: i18next.t('auth:text_err_password_blank'),
          pattern: {
            value: validation.passwordRegex,
            message: i18next.t('auth:text_err_password_format'),
          },
        }}
        loading={false}
        disableInput={false}
        testID={'testID'}
        label={i18next.t('auth:input_label_new_password')}
        placeholder={i18next.t('auth:input_label_new_password')}
        validateValue={validateNewPassword}
      />,
    );

    const textInput = wrapper.getByTestId('testID');
    expect(textInput).toBeDefined();
    fireEvent.changeText(textInput, '1');

    expect(validateNewPassword).toHaveBeenCalled();

    const helperText = wrapper.queryByTestId('text_input.text_helper');
    expect(helperText).not.toBeNull();
    expect(helperText?.props?.children?.[0]).toBe(
      i18next.t('auth:text_err_password_format'),
    );
  });
});
