import React from 'react';
import { useController } from 'react-hook-form';
import PasswordInput, { PasswordInputProps } from '~/baseComponents/Input/PasswordInput';

import { IObject } from '~/interfaces/common';

interface Props extends PasswordInputProps {
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
      helperText={errors?.[name]?.message}
      {...props}
    />
  );
};

export default PasswordInputController;
