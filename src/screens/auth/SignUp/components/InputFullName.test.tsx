import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import InputFullName from './InputFullName';

describe('InputFullName component', () => {
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

  const baseProps = {
    useFormData: useForm,
    signUpError: 'test',
    loading: false,
    checkDisableSignUp: jest.fn(),
    onSubmit: jest.fn(),
  };

  it('renders correctly', async () => {
    const rendered = render(<InputFullName {...baseProps} />);
    const { getByTestId } = rendered;
    const inputComponent = getByTestId('input_full_name');
    expect(inputComponent).toBeDefined();
    await fireEvent.changeText(inputComponent, 'abc');
    expect(baseProps.checkDisableSignUp).toBeCalled();
  });
});
