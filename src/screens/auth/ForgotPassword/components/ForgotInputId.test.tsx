import * as React from 'react';
import { cleanup, fireEvent } from '@testing-library/react-native';
import ForgotInputId from './ForgotInputId';
import {
  configureStore,
  renderWithRedux,
  rerenderWithRedux,
} from '~/test/testUtils';
import initialState from '~/storeRedux/initialState';

afterEach(cleanup);

describe('ForgotInputId component', () => {
  let Keyboard: any;

  const mockStore = configureStore([]);

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Keyboard = require('react-native').Keyboard;
  });

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
        // email: {
        //   type: 'validate',
        //   message: 'signingInError',
        // },
        // password: {
        //   type: 'validate',
        //   message: 'signingInError',
        // },
      },
    },
    watch: () => jest.fn(),
  };

  // it(`renders correctly`, () => {
  //   const forgotPasswordError = {
  //     errBox: '',
  //     errRequest: '',
  //     errConfirm: '',
  //   };
  //   const storeData = {...initialState};

  //   storeData.auth.forgotPasswordStage = '';
  //   storeData.auth.forgotPasswordLoading = false;
  //   storeData.auth.forgotPasswordError = forgotPasswordError as any;
  //   const store = mockStore(storeData);
  //   const wrapper = renderWithRedux(
  //     <ForgotInputId useFormData={useForm} />,
  //     store,
  //   );
  //   expect(wrapper.toJSON()).toMatchSnapshot();
  // });

  it('disable button send code to email when typing an invalid email', async () => {
    const newUseForm = {
      ...useForm,
      getValues: () => 'y',
    };

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
      <ForgotInputId useFormData={newUseForm} />,
      store,
    );

    const textInputComponent = wrapper.getByTestId('inputEmail');
    expect(textInputComponent).toBeDefined();
    fireEvent.changeText(textInputComponent, 'y');

    const buttonSend = wrapper.getByTestId('btnSend');
    expect(buttonSend).toBeDefined();
    expect(buttonSend.props?.accessibilityState?.disabled).toBe(true);
  });

  it('request code to forgot password with valid email', async () => {
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
      <ForgotInputId useFormData={useForm} />,
      store,
    );

    const buttonSend = wrapper.getByTestId('btnSend');
    expect(buttonSend).toBeDefined();
    expect(buttonSend.props?.accessibilityState?.disabled).toBe(true);

    const textInputComponent = wrapper.getByTestId('inputEmail');
    expect(textInputComponent).toBeDefined();
    fireEvent.changeText(textInputComponent, 'thuquyen@tgm.vn');

    const getValues = jest.fn().mockImplementation((input: string) => {
      switch (input) {
        case 'email':
          return 'thuquyen@tgm.vn';
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

    rerenderWithRedux(
      wrapper,
      <ForgotInputId useFormData={newUseForm} />,
      store,
    );

    expect(buttonSend.props?.accessibilityState?.disabled).toBe(false);
    fireEvent.press(buttonSend);

    expect(getValues).toBeCalledWith('email');
    expect(setValue).toBeCalledWith('code', '', { shouldValidate: false });
    expect(clearErrors).toBeCalledWith('code');
  });
});
