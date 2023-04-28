import React from 'react';
import { StyleSheet } from 'react-native';

import * as validation from '~/constants/commonRegex';
import { useBaseHook } from '~/hooks';

import { spacing } from '~/theme';
import { FieldNameType } from '~/interfaces/IAuth';
import FormInput from '../../components/FormInput';

interface Props {
  useFormData: any;
  signUpError: any;
  checkDisableSignUp: () => void;
  onSubmit: () => void;
  loading: boolean;
}

const InputEmail = ({
  useFormData,
  signUpError,
  checkDisableSignUp,
  onSubmit,
  loading = false,
}: Props) => {
  const { t } = useBaseHook();

  const emailRules = {
    required: t('auth:text_err_email_blank'),
    pattern: {
      value: validation.emailRegex,
      message: t('auth:text_err_email_format'),
    },
  };

  const onValidateValue = async () => {
    await useFormData.trigger(FieldNameType.EMAIL);
    checkDisableSignUp();
  };

  return (
    <FormInput
      useFormData={useFormData}
      fieldName={FieldNameType.EMAIL}
      errorText={signUpError}
      rules={emailRules}
      testID="input_email"
      label="auth:input_label_email"
      placeholder="auth:input_label_email_placeholder"
      isAutoFocus
      keyboardType="email-address"
      autoCapitalize="none"
      styleLabel={styles.label}
      onSubmit={onSubmit}
      validateValue={onValidateValue}
      isEditable={!loading}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: spacing.margin.small,
  },
});

export default InputEmail;
