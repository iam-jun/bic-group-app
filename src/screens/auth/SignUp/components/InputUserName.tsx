import React from 'react';
import { StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
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

const InputUserName = ({
  useFormData,
  signUpError,
  checkDisableSignUp,
  onSubmit,
  loading = false,
}: Props) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();

  const rules = {
    required: t('auth:text_err_user_name_required'),
    maxLength: {
      value: 50,
      message: t('auth:text_err_user_name'),
    },
    minLength: {
      value: 5,
      message: t('auth:text_err_user_name'),
    },
    pattern: {
      value: validation.userNameRegex,
      message: t('auth:text_err_user_name'),
    },
  };

  const onValidateValue = async () => {
    await useFormData.trigger(FieldNameType.USER_NAME);
    checkDisableSignUp();
  };

  return (
    <>
      <FormInput
        useFormData={useFormData}
        fieldName={FieldNameType.USER_NAME}
        errorText={signUpError}
        rules={rules}
        testID="input_user_name"
        label="auth:input_label_username"
        placeholder="auth:input_label_username_placeholder"
        keyboardType="email-address"
        autoCapitalize="none"
        styleLabel={styles.label}
        onSubmit={onSubmit}
        validateValue={onValidateValue}
        isEditable={!loading}
      />
      <Text.BodyS color={colors.neutral40} style={styles.textDescription} useI18n>
        auth:text_warning_username
      </Text.BodyS>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: spacing.margin.small,
  },
  textDescription: {
    marginTop: spacing.margin.tiny,
  },
});

export default InputUserName;
