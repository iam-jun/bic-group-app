import React from 'react';
import { useController } from 'react-hook-form';
import { TextInput as RNTextInput } from 'react-native';
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

const _PasswordInputController = React.forwardRef((
  props: Props, ref?: React.Ref<RNTextInput>,
) => (
  <PasswordInputController passwordInputRef={ref} {...props} />
));

export default _PasswordInputController;
