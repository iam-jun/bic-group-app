import React from 'react';
import {
  TextInput as RNTextInput,
} from 'react-native';

import { useController } from 'react-hook-form';
import { TextInput } from '~/baseComponents/Input';
import { TextInputProps } from '~/baseComponents/Input/TextInput';

import { IObject } from '~/interfaces/common';

interface Props extends Partial<TextInputProps> {
  useFormData: IObject<any>;
  validateValue: (text: string) => void;
  name: string;
  rules?: any;
  defaultValue?: any;
  testID: string;
  label?: string;
  placeholder: string;
  helperActionOnPress?: () => void;
  helperAction?: string;
  helperContent?: string;
  textInputRef?: React.Ref<RNTextInput>;
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
  helperContent,
  textInputRef,
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
      error={errors?.[name]}
      value={value}
      onChangeText={(text) => {
        onChange(text.trim());
        validateValue(text);
      }}
      helperType={errors?.[name]?.message ? 'error' : undefined}
      helperText={
        errors?.[name]?.message === helperContent ? '' : errors?.[name]?.message
      }
      helperAction={helperAction}
      helperActionOnPress={helperActionOnPress}
      ref={textInputRef}
      {...props}
    />
  );
};

const _TextInputController = React.forwardRef((props: Props, ref?: React.Ref<RNTextInput>) => (
  <TextInputController textInputRef={ref} {...props} />
));

export default React.memo(_TextInputController);
