import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/beinComponents/Text';
import TextInputController from '~/beinComponents/inputs/TextInputController';
import * as validation from '~/constants/commonRegex';
import { useBaseHook } from '~/hooks';

import { spacing } from '~/theme';

interface InputEmailProps {
  useFormData: any;
  signingInError: any;
  loading: boolean;
  authSessions: any;
  clearFieldError: (name: 'email' | 'password') => void;
  checkDisableSignIn: () => void
  onSubmitEmail: () => void;
}

const InputEmail = ({
  useFormData,
  signingInError,
  loading,
  authSessions,
  clearFieldError,
  checkDisableSignIn,
  onSubmitEmail,
}: InputEmailProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyles(theme);
  const { t } = useBaseHook();
  const inputEmailRef = useRef<any>();

  useEffect(
    () => {
      inputEmailRef.current?.focus();
    }, [],
  );

  const emailRules = {
    required: t('auth:text_err_email_blank'),
    pattern: {
      value: validation.emailRegex,
      message: t('auth:text_err_email_format'),
    },
  };

  const onValidateValue = () => {
    clearFieldError('email');
    checkDisableSignIn();
  };

  return (
    <>
      <Text.LabelM color={colors.neutral40} useI18n>
        auth:input_label_email
      </Text.LabelM>
      <TextInputController
        textInputRef={inputEmailRef}
        testID="input_email"
        autoFocus
        useFormData={useFormData}
        name="email"
        rules={emailRules}
        validateValue={onValidateValue}
        placeholder={t('auth:input_label_email_placeholder')}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.inputEmailContainer}
        inputStyle={styles.input}
        helperContent={signingInError}
        editable={!authSessions && !loading}
        onSubmitEditing={onSubmitEmail}
        placeholderTextColor={colors.neutral20}
        textColor={colors.neutral60}
        helperStyle={styles.errorText}
      />
    </>

  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    inputEmailContainer: {
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

export default InputEmail;
