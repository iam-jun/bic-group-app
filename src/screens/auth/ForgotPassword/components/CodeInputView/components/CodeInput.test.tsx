import * as React from 'react';
import { cleanup } from '@testing-library/react-native';
import CodeInput from './CodeInput';
import { renderHook, renderWithRedux, act } from '~/test/testUtils';
import useForgotPasswordStore from '../../../store';

afterEach(cleanup);

describe('CodeInput component', () => {
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

  it('renders text error', () => {
    const error = 'auth:text_err_wrong_code';
    const { result } = renderHook(() => useForgotPasswordStore());

    act(() => {
      result.current.actions.setErrorConfirm(error);
    });

    const wrapper = renderWithRedux(<CodeInput useFormData={useForm} />);

    const textError = wrapper.queryByTestId('forgot_password.text_error');
    expect(textError).toBeDefined();
  });
});
