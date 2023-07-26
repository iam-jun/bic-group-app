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

const InputFullName = ({
  useFormData,
  signUpError,
  loading = false,
  checkDisableSignUp,
  onSubmit,
}: Props) => {
  const { t } = useBaseHook();

  const rules = {
    required: t('auth:text_err_full_name_required'),
    maxLength: {
      value: 64,
      message: t('profile:fullname_rule:character_length'),
    },
    minLength: {
      value: 3,
      message: t('profile:fullname_rule:character_length'),
    },
    validate: () => {
      const fullName = useFormData.getValues(FieldNameType.FULL_NAME);
      if (/\d/.test(fullName)) {
        return t('profile:fullname_rule:not_allow_number');
      }
      if (fullName?.length > 0 && !validation.fullNameRegex.test(fullName)) {
        return t('profile:fullname_rule:not_allow_special_character');
      }
    },
  };

  const onValidateValue = async () => {
    await useFormData.trigger(FieldNameType.FULL_NAME);
    checkDisableSignUp();
  };

  return (
    <FormInput
      useFormData={useFormData}
      fieldName={FieldNameType.FULL_NAME}
      errorText={signUpError}
      rules={rules}
      testID="input_full_name"
      label="auth:input_label_full_name"
      placeholder="auth:input_label_full_name_placeholder"
      styleLabel={styles.label}
      onSubmit={onSubmit}
      validateValue={onValidateValue}
      isEditable={!loading}
      autoCapitalize="words"
    />
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: spacing.margin.small,
  },
});

export default InputFullName;
