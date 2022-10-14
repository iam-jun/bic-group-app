import { StyleSheet } from 'react-native';
import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { spacing } from '~/theme';
import { useBaseHook } from '~/hooks';
import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';

interface InputPasswordProps {
  inputPasswordRef: any;
  useFormData: any;
  loading: boolean;
  clearFieldError: (name: 'email' | 'password') => void;
  checkDisableSignIn: () => void
  onSignIn: () => void
}

const InputPassword = ({
  inputPasswordRef,
  useFormData,
  loading,
  clearFieldError,
  checkDisableSignIn,
  onSignIn,
}: InputPasswordProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);
  const { colors } = theme;
  const { t } = useBaseHook();

  const passwordRules = {
    // REQ: No need to validate password to follow policy
    // only show "don't match" result
    required: t('auth:text_err_password_blank'),
  };

  const onValidateValue = () => {
    clearFieldError('password');
    checkDisableSignIn();
  };

  return (
    <PasswordInputController
      ref={inputPasswordRef}
      useFormData={useFormData}
      testID="input_password"
      name="password"
      label={t('auth:input_label_password')}
      labelProps={{ color: colors.neutral40 }}
      rules={passwordRules}
      placeholder={t('auth:input_label_password_placeholder')}
      validateValue={onValidateValue}
      onSubmitEditing={onSignIn}
      inputStyle={styles.input}
      style={styles.inputPassword}
      placeholderTextColor={colors.neutral20}
      iconColor={colors.neutral40}
      textColor={colors.neutral40}
      helperStyle={styles.errorText}
      editable={!loading}
    />
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    inputPassword: {
      marginVertical: spacing.margin.small,
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

export default InputPassword;
