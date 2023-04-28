import React from 'react';

import { render } from '~/test/testUtils';
import FormInput from './FormInput';
import { FieldNameType } from '~/interfaces/IAuth';

describe('FormInput component', () => {
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
    fieldName: FieldNameType.EMAIL,
    testID: 'test',
    onSubmit: jest.fn(),
    validateValue: jest.fn(),
  };

  it('renders correctly', () => {
    const rendered = render(<FormInput {...baseProps} />);
    const { getByTestId } = rendered;
    const inputComponent = getByTestId(baseProps.testID);
    expect(inputComponent).toBeDefined();
  });
});
