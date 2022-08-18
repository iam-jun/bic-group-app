import React from 'react';
import { useController } from 'react-hook-form';

import { IObject } from '~/interfaces/common';
import TextInput, { TextInputProps } from './TextInput';

interface Props extends Partial<TextInputProps> {
  useFormData: IObject<any>;
  validateValue: (text: string) => void;
  name: string;
  rules: any;
  defaultValue?: any;
  testID: string;
  label?: string;
  placeholder: string;
  helperActionOnPress?: () => void;
  helperAction?: string;
  helperContentTriggerAction?: string;
  helperContent?: string;
}

const TextInputController: React.FC<Props> = ({
  useFormData,
  validateValue,
  name,
  rules,
  defaultValue,
  helperAction,
  helperActionOnPress,
  testID,
  label,
  placeholder,
  helperContentTriggerAction,
  helperContent,
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
    defaultValue: defaultValue || '',
  });

  return (
    <TextInput
      testID={testID}
      placeholder={placeholder}
      error={errors?.code}
      value={value}
      onChangeText={(text) => {
        onChange(text.trim());
        validateValue(text);
      }}
      helperType={errors?.[name]?.message ? 'error' : undefined}
      helperContent={
        errors?.[name]?.message === helperContent ? '' : errors?.[name]?.message
      }
      helperAction={helperAction}
      helperContentTriggerAction={helperContentTriggerAction}
      helperActionOnPress={helperActionOnPress}
      {...props}
    />
  );
};

export default TextInputController;
