import React from 'react';
import {useController} from 'react-hook-form';
import { useTheme } from 'react-native-paper';

import {IObject} from '~/interfaces/common';
import { ITheme } from '~/theme/interfaces';
import TextInput, {TextInputProps} from './TextInput';
import {fontFamilies} from '~/theme/fonts';

interface Props extends TextInputProps {
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
  mode?: string;
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
  mode='outlined',
  disabled,
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

   const theme: ITheme = useTheme() as ITheme;
   const {spacing, colors} = theme;

  // if (mode==='flat'){
  // const customTheme = {
  //   colors: {
  //     primary: colors.borderFocus,
  //     text: errors?.code ? colors.error : colors.textPrimary,
  //     placeholder: colors.textSecondary,
  //     background: disabled ? colors.bgDisable : ,
  //   },
  //   roundness: spacing?.borderRadius.small,
  //   fonts: {
  //     regular: {
  //       fontFamily: fontFamilies.OpenSans,
  //     },
  //   },
  // };
  // }

    return (
      <TextInput
        testID={testID}
        label={label}
        placeholder={placeholder}
        error={errors?.code}
        value={value}
        // editable={!loading}
        onChangeText={text => {
          onChange(text.trim());
          validateValue(text);
        }}
        helperType={errors?.[name]?.message ? 'error' : undefined}
        helperContent={
          errors?.[name]?.message === helperContent
            ? ''
            : errors?.[name]?.message
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
