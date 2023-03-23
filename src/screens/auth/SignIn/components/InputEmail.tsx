import React from 'react';
import { StyleSheet } from 'react-native';

import * as validation from '~/constants/commonRegex';
import { useBaseHook } from '~/hooks';

import { FieldNameType } from '~/interfaces/IAuth';
import { spacing } from '~/theme';
import FormInput from '../../components/FormInput';

interface InputEmailProps {
  useFormData: any;
  signingInError: any;
  loading: boolean;
  authSessions: any;
  clearFieldError: (name: FieldNameType) => void;
  checkDisableSignIn: () => void;
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
  const { t } = useBaseHook();

  const emailRules = {
    required: t('auth:text_err_email_blank'),
    pattern: {
      value: validation.emailRegex,
      message: t('auth:text_err_email_format'),
    },
  };

  const onValidateValue = () => {
    clearFieldError(FieldNameType.EMAIL);
    checkDisableSignIn();
  };

  const isEditable = !authSessions?.email && !loading;

  return (
    <FormInput
      useFormData={useFormData}
      fieldName={FieldNameType.EMAIL}
      errorText={signingInError}
      rules={emailRules}
      testID="input_email"
      label="auth:input_label_email"
      placeholder="auth:input_label_email_placeholder"
      isAutoFocus
      isEditable={isEditable}
      keyboardType="email-address"
      autoCapitalize="none"
      styleInput={styles.input}
      onSubmit={onSubmitEmail}
      validateValue={onValidateValue}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: spacing.margin.small,
  },
});

export default InputEmail;
