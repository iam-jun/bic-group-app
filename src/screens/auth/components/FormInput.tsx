import React, { useEffect, useRef } from 'react';
import {
  KeyboardTypeOptions, StyleProp, StyleSheet, TextStyle, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import TextInputController from '~/beinComponents/inputs/TextInputController';
import { useBaseHook } from '~/hooks';

import { spacing } from '~/theme';
import { FieldNameType } from '~/interfaces/IAuth';

interface Props {
  useFormData: any;
  fieldName: FieldNameType;
  errorText?: any;
  rules?: any;
  testID?: string;
  label?: string;
  placeholder?: string;
  isAutoFocus?: boolean;
  isEditable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'sentences' | 'none' | 'words' | 'characters';
  styleLabel?: TextStyle;
  styleInput?: StyleProp<ViewStyle>;
  onSubmit: () => void;
  validateValue: () => void;
}

const FormInput = ({
  useFormData,
  fieldName = FieldNameType.EMAIL,
  errorText,
  rules,
  testID,
  label,
  placeholder,
  isAutoFocus = false,
  isEditable = true,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  styleLabel = {},
  styleInput = {},
  onSubmit,
  validateValue,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme, label);
  const { t } = useBaseHook();
  const inputRef = useRef<any>();

  useEffect(() => {
    if (isAutoFocus) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <>
      {!!label && (
        <Text.LabelM color={colors.neutral40} useI18n style={styleLabel}>
          {label}
        </Text.LabelM>
      )}
      <TextInputController
        textInputRef={inputRef}
        useFormData={useFormData}
        name={fieldName}
        testID={testID}
        autoFocus={isAutoFocus}
        rules={rules}
        placeholder={t(placeholder)}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        validateValue={validateValue}
        onSubmitEditing={onSubmit}
        style={[styles.inputContainer, styleInput]}
        inputStyle={isEditable && styles.input}
        helperContent={errorText}
        placeholderTextColor={colors.neutral20}
        textColor={colors.neutral60}
        helperStyle={errorText && styles.errorText}
        editable={isEditable}
      />
    </>
  );
};

const createStyles = (theme: ExtendedTheme, label: string) => {
  const { colors } = theme;

  return StyleSheet.create({
    inputContainer: {
      marginTop: label ? spacing.margin.small : 0,
    },
    input: {
      backgroundColor: 'transparent',
    },
    errorText: {
      backgroundColor: colors.white,
      paddingVertical: spacing.padding.tiny,
      marginTop: spacing.margin.tiny,
    },
  });
};

export default FormInput;
