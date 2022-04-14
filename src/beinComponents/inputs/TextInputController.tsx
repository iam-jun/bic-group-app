import React from 'react';
import {useController} from 'react-hook-form';

import {IObject} from '~/interfaces/common';
import TextInput, {TextInputProps} from './TextInput';

interface Props extends TextInputProps {
  useFormData: IObject<any>;
  validateValue: (text: string) => void;
  loading?: boolean;
  name: string;
  rules: any;
  defaultValue?: any;
  testID: string;
  label: string;
  placeholder: string;
  helperActionOnPress?: () => void;
  helperAction?: string;
  helperContentTriggerAction?: string;
  helperContent?: string;
}

const TextInputController: React.FC<Props> = ({
  useFormData,
  validateValue,
  loading,
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
    formState: {errors},
  } = useFormData;

  const {
    field: {onChange, value},
  } = useController({
    control,
    name: name,
    rules: rules,
    defaultValue: defaultValue || '',
  });

  return (
    <TextInput
      testID={testID}
      label={label}
      placeholder={placeholder}
      error={errors?.code}
      value={value}
      editable={!loading}
      onChangeText={text => {
        onChange(text.trim());
        validateValue(text);
      }}
      helperType={errors?.[name]?.message ? 'error' : undefined}
      helperContent={
        errors?.[name]?.message === helperContent ? '' : errors?.[name]?.message
      }
      helperAction={helperAction}
      // @ts-ignore
      helperContentTriggerAction={helperContentTriggerAction}
      helperActionOnPress={helperActionOnPress}
      {...props}
    />
  );
};

export default TextInputController;
