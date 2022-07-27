import React from 'react';
import { useController } from 'react-hook-form';

import PasswordInput from './PasswordInput';
import { IObject } from '~/interfaces/common';
import { TextInputProps } from './TextInput';

interface Props extends TextInputProps {
  useFormData: IObject<any>;
  name: string;
  rules: any;
  loading?: boolean;
  testID: string;
  placeholder: string;
  validateValue?: () => void;
  ref?: any;
  iconColor?: string;
}

const PasswordInputController: React.FC<Props> = ({
  useFormData,
  name,
  rules,
  loading,
  testID,
  placeholder,
  validateValue,
  ref,
  ...props
}) => {
  const {
    control,
    formState: { errors },
  } = useFormData;

  const {
    field: { onChange, value },
  } = useController({
    control,
    name,
    rules,
    defaultValue: '',
  });

  return (
    <PasswordInput
      ref={ref}
      testID={testID}
      placeholder={placeholder}
      error={errors?.[name]}
      autoCapitalize="none"
      editable={!loading}
      value={value}
      onChangeText={(text) => {
        onChange(text);
        validateValue?.();
      }}
      helperType={errors?.[name]?.message ? 'error' : undefined}
      helperContent={errors?.[name]?.message}
      {...props}
    />
  );
};

export default PasswordInputController;
