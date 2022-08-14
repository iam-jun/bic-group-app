import * as React from 'react';
import { cleanup, fireEvent } from '@testing-library/react-native';
import ForgotInputCodePw from './ForgotInputCodePw';
import {
  configureStore,
  renderWithRedux,
  rerenderWithRedux,
} from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';

afterEach(cleanup);

describe('ForgotInputCodePw component', () => {
  const mockStore = configureStore([]);

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

  it('renders correctly', () => {
    const forgotPasswordError = {
      errBox: '',
      errRequest: '',
      errConfirm: '',
    };
    const storeData = { ...initialState };

    storeData.auth.forgotPasswordStage = '';
    // storeData.auth.forgotPasswordLoading = false;
    storeData.auth.forgotPasswordError = forgotPasswordError as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <ForgotInputCodePw useFormData={useForm} />,
      store,
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
  });

  it('show error text when typing an invalid code', async () => {
    const forgotPasswordError = {
      errBox: '',
      errRequest: 'ERRORS!!!!',
      errConfirm: '',
    };
    const storeData = { ...initialState };

    storeData.auth.forgotPasswordStage = '';
    // storeData.auth.forgotPasswordLoading = false;
    storeData.auth.forgotPasswordError = forgotPasswordError as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <ForgotInputCodePw useFormData={useForm} />,
      store,
    );

    // disable input new password
    const newPassword = wrapper.getByTestId('inputNewPassword');
    expect(newPassword).toBeDefined();

    // disable input confirm password
    const confirmPassword = wrapper.getByTestId('inputConfirmPassword');
    expect(confirmPassword).toBeDefined();

    // disable button change password
    const btnChangePassword = wrapper.getByTestId('btnChangePassword');
    expect(btnChangePassword).toBeDefined();
    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(true);

    // show error text when typing wrong format code
    const textInputComponent = wrapper.getByTestId('inputCode');
    expect(textInputComponent).toBeDefined();
    fireEvent.changeText(textInputComponent, '3,');

    const newUseForm1 = {
      ...useForm,
      getValues: () => '3,',
      formState: {
        errors: {
          code: {
            type: 'validate',
            message: 'Error 1',
          },
        },
      },
    };

    rerenderWithRedux(
      wrapper,
      <ForgotInputCodePw useFormData={newUseForm1} />,
      store,
    );

    // disable button change password
    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(true);

    const helperText = wrapper.queryByTestId('text_input.text_helper');
    expect(helperText).not.toBeNull();
    expect(helperText?.props?.children?.[0]).toBe('Error 1');

    // update props when delete all code
    fireEvent.changeText(textInputComponent, '');
    const newUseForm2 = {
      ...useForm,
      getValues: () => '',
      formState: {
        errors: {
          code: {
            type: 'validate',
            message: 'Error 2',
          },
        },
      },
    };
    rerenderWithRedux(
      wrapper,
      <ForgotInputCodePw useFormData={newUseForm2} />,
      store,
    );
    expect(helperText?.props?.children?.[0]).toBe('Error 2');

    // disable button change password
    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(true);
  });

  it('show error text when typing an invalid new password', async () => {
    const forgotPasswordError = {
      errBox: '',
      errRequest: '',
      errConfirm: '',
    };
    const storeData = { ...initialState };

    storeData.auth.forgotPasswordStage = '';
    // storeData.auth.forgotPasswordLoading = false;
    storeData.auth.forgotPasswordError = forgotPasswordError as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <ForgotInputCodePw useFormData={useForm} />,
      store,
    );

    // input new password
    const newPassword = wrapper.getByTestId('inputNewPassword');
    expect(newPassword).toBeDefined();

    // input confirm password
    const confirmPassword = wrapper.getByTestId('inputConfirmPassword');
    expect(confirmPassword).toBeDefined();

    // button change password
    const btnChangePassword = wrapper.getByTestId('btnChangePassword');
    expect(btnChangePassword).toBeDefined();
    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(true);

    // typing valid code
    const textInputComponent = wrapper.getByTestId('inputCode');
    expect(textInputComponent).toBeDefined();
    fireEvent.changeText(textInputComponent, '123456');

    // rerender component with valid code
    const newUseForm1 = {
      ...useForm,
      getValues: (input: string) => {
        switch (input) {
          case 'code':
            return '123456';
          case 'newPassword':
            return '1';
          case 'confirmPassword':
            return '1';
          default:
            return '';
        }
      },
      formState: {
        errors: {
          newPassword: {
            type: 'validate',
            message: 'Invalid password',
          },
        },
      },
    };

    rerenderWithRedux(
      wrapper,
      <ForgotInputCodePw useFormData={newUseForm1} />,
      store,
    );

    // disable button change password
    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(true);

    // typing new password with invalid password
    fireEvent.changeText(newPassword, '1');

    // show error text
    const helperText = wrapper.queryByTestId('text_input.text_helper');
    expect(helperText).not.toBeNull();
    expect(helperText?.props?.children?.[0]).toBe('Invalid password');

    // update props when delete all code
    fireEvent.changeText(newPassword, '');

    const newUseForm2 = {
      ...useForm,
      getValues: (input: string) => {
        switch (input) {
          case 'code':
            return '123456';
          case 'newPassword':
            return '';
          case 'confirmPassword':
            return '1';
          default:
            return '';
        }
      },
      formState: {
        errors: {
          newPassword: {
            type: 'validate',
            message: 'Password is required',
          },
        },
      },
    };
    rerenderWithRedux(
      wrapper,
      <ForgotInputCodePw useFormData={newUseForm2} />,
      store,
    );
    expect(helperText?.props?.children?.[0]).toBe('Password is required');
  });

  it('show error text when typing an invalid confirm password', async () => {
    const forgotPasswordError = {
      errBox: '',
      errRequest: '',
      errConfirm: '',
    };
    const storeData = { ...initialState };

    storeData.auth.forgotPasswordStage = '';
    // storeData.auth.forgotPasswordLoading = false;
    storeData.auth.forgotPasswordError = forgotPasswordError as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <ForgotInputCodePw useFormData={useForm} />,
      store,
    );

    // input new password
    const newPassword = wrapper.getByTestId('inputNewPassword');
    expect(newPassword).toBeDefined();

    // input confirm password
    const confirmPassword = wrapper.getByTestId('inputConfirmPassword');
    expect(confirmPassword).toBeDefined();

    // disable button change password
    const btnChangePassword = wrapper.getByTestId('btnChangePassword');
    expect(btnChangePassword).toBeDefined();
    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(true);

    // typing valid code
    const textInputComponent = wrapper.getByTestId('inputCode');
    expect(textInputComponent).toBeDefined();
    fireEvent.changeText(textInputComponent, '123456');

    // rerender component with valid code
    const newUseForm1 = {
      ...useForm,
      getValues: (input: string) => {
        switch (input) {
          case 'code':
            return '123456';
          case 'newPassword':
            return '1234567890';
          case 'confirmPassword':
            return '1';
          default:
            return '';
        }
      },
      formState: {
        errors: {
          newPassword: {
            type: 'validate',
            message: 'Invalid password',
          },
        },
      },
    };

    rerenderWithRedux(
      wrapper,
      <ForgotInputCodePw useFormData={newUseForm1} />,
      store,
    );

    // still disable button change password
    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(true);

    // typing new password with invalid password
    fireEvent.changeText(newPassword, '1234567890');
    fireEvent.changeText(confirmPassword, '1');

    // show error text
    const helperText = wrapper.queryByTestId('text_input.text_helper');
    expect(helperText).not.toBeNull();
    expect(helperText?.props?.children?.[0]).toBe('Invalid password');

    // update props when delete all code
    fireEvent.changeText(confirmPassword, '');

    const newUseForm2 = {
      ...useForm,
      getValues: (input: string) => {
        switch (input) {
          case 'code':
            return '123456';
          case 'newPassword':
            return '1234567890';
          case 'confirmPassword':
            return '';
          default:
            return '';
        }
      },
      formState: {
        errors: {
          newPassword: {
            type: 'validate',
            message: 'Confirm password is required',
          },
        },
      },
    };
    rerenderWithRedux(
      wrapper,
      <ForgotInputCodePw useFormData={newUseForm2} />,
      store,
    );
    expect(helperText?.props?.children?.[0]).toBe(
      'Confirm password is required',
    );
    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(true);
  });

  it('enable button change password when filled valid data', async () => {
    const forgotPasswordError = {
      errBox: '',
      errRequest: '',
      errConfirm: '',
    };
    const storeData = { ...initialState };

    storeData.auth.forgotPasswordStage = '';
    // storeData.auth.forgotPasswordLoading = false;
    storeData.auth.forgotPasswordError = forgotPasswordError as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <ForgotInputCodePw useFormData={useForm} />,
      store,
    );

    // input new password
    const newPassword = wrapper.getByTestId('inputNewPassword');
    expect(newPassword).toBeDefined();

    // input confirm password
    const confirmPassword = wrapper.getByTestId('inputConfirmPassword');
    expect(confirmPassword).toBeDefined();

    // disable button change password
    const btnChangePassword = wrapper.getByTestId('btnChangePassword');
    expect(btnChangePassword).toBeDefined();
    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(true);

    // typing valid code
    const textInputComponent = wrapper.getByTestId('inputCode');
    expect(textInputComponent).toBeDefined();
    fireEvent.changeText(textInputComponent, '123456');

    // rerender component with valid code
    const newUseForm1 = {
      ...useForm,
      getValues: (input: string) => {
        switch (input) {
          case 'email':
            return 'thuquyen@tgm.vn';
          case 'code':
            return '123456';
          default:
            return '';
        }
      },
      formState: {
        errors: {},
      },
    };

    rerenderWithRedux(
      wrapper,
      <ForgotInputCodePw useFormData={newUseForm1} />,
      store,
    );

    // still disable button change password
    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(true);

    // typing new password with invalid password
    fireEvent.changeText(newPassword, '1234567890');
    fireEvent.changeText(confirmPassword, '1234567890');
    // rerender component with updated props
    const getValues = jest.fn().mockImplementation((input: string) => {
      switch (input) {
        case 'email':
          return 'thuquyen@tgm.vn';
        case 'code':
          return '123456';
        case 'newPassword':
          return '1234567890';
        case 'confirmPassword':
          return '1234567890';
        default:
          return '';
      }
    });
    const newUseForm2 = {
      ...useForm,
      getValues,
      formState: {
        errors: {},
      },
    };

    rerenderWithRedux(
      wrapper,
      <ForgotInputCodePw useFormData={newUseForm2} />,
      store,
    );

    expect(btnChangePassword.props?.accessibilityState?.disabled).toBe(false);
    fireEvent.press(btnChangePassword);
    expect(getValues).toBeCalledWith('email');
    expect(getValues).toBeCalledWith('code');
    expect(getValues).toBeCalledWith('newPassword');
    expect(getValues).toBeCalledWith('confirmPassword');
  });

  it('request forgot password when click help action', () => {
    const forgotPasswordError = {
      errBox: '',
      errRequest: '',
      errConfirm: 'ERROR!!!',
    };
    const storeData = { ...initialState };
    const setError = jest.fn();
    const newUseForm1 = {
      ...useForm,
      setError,
    };

    storeData.auth.forgotPasswordStage = '';
    // storeData.auth.forgotPasswordLoading = false;
    storeData.auth.forgotPasswordError = forgotPasswordError as any;
    const store = mockStore(storeData);
    const wrapper = renderWithRedux(
      <ForgotInputCodePw useFormData={newUseForm1} />,
      store,
    );

    expect(setError).toBeCalledWith('code', {
      type: 'manual',
      message: forgotPasswordError.errConfirm,
    });
  });
});
