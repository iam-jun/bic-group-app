import React from 'react';

import { fireEvent, render } from '~/test/testUtils';
import FormCheckPassword from './FormCheckPassword';
import { FieldNameType } from '~/interfaces/IAuth';

describe('FormCheckPassword component', () => {
  const text = 'abc';
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
    getValues: () => text,
    setValue: () => jest.fn(),
    formState: {
      errors: {},
    },
    watch: () => jest.fn(),
  };

  const baseProps = {
    useFormData: useForm,
    fieldName: FieldNameType.NEW_PASSWORD,
    isConfirmPassword: true,
  };

  it('renders correctly', () => {
    const rendered = render(<FormCheckPassword {...baseProps} />);
    const { getByTestId } = rendered;
    const inputComponent = getByTestId('form_check_password.input');
    expect(inputComponent).toBeDefined();
    fireEvent.changeText(inputComponent, text);
    expect(useForm.clearErrors).toBeCalled();
  });
});
