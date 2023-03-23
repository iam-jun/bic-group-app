import React, { useState } from 'react';
import { StyleSheet, View, TextStyle } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { IObject } from '~/interfaces/common';
import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';
import { FieldNameType, IFormCheckPassword } from '~/interfaces/IAuth';
import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import { validateRules } from '../helper';
import Icon from '~/baseComponents/Icon';
import { spacing } from '~/theme';

interface Props {
  useFormData: IObject<any>;
  fieldName: FieldNameType;
  label?: string;
  placeholder?: string;
  loading?: boolean;
  isConfirmPassword?: boolean;
  isCheckLowercaseLetter?: boolean;
  styleLabel?: TextStyle;
  checkDisableBtn?: () => void;
}

const FormCheckPassword: React.FC<Props> = ({
  useFormData,
  fieldName = FieldNameType.NEW_PASSWORD,
  label = 'auth:input_label_new_password',
  placeholder = 'auth:input_label_new_password',
  loading = false,
  isConfirmPassword = false,
  isCheckLowercaseLetter = false,
  styleLabel = {},
  checkDisableBtn,
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();
  const styles = themeStyles(theme);
  const [form, setForm] = useState<IFormCheckPassword>();

  const {
    trigger, getValues, clearErrors, setError,
  } = useFormData;

  const value = getValues(fieldName);

  React.useEffect(() => {
    if (!value) {
      resetForm();
    }
  }, [value]);

  const resetForm = () => {
    setForm({
      isLimitCharacter: false,
      isUppercaseLetter: false,
      isDigits: false,
      isSpecialCharacter: false,
      isLowercaseLetter: false,
    });
  };

  const validateValue = async () => {
    const value = getValues(fieldName);
    if (isConfirmPassword) {
      const confirmPassword = getValues(FieldNameType.CONFIRM_PASSWORD);
      if (confirmPassword) {
        if (value === confirmPassword) {
          clearErrors(FieldNameType.CONFIRM_PASSWORD);
        } else {
          setError(FieldNameType.CONFIRM_PASSWORD, {
            type: 'manual',
            message: t('auth:text_err_confirm_password_not_matched'),
          });
        }
      }
    }
    await trigger(fieldName);
    checkDisableBtn?.();
  };

  const renderRowCheck = (status: boolean, text: string) => {
    const isCheckTintColor = status ? colors.green50 : colors.neutral20;
    const isCheckStyle = status ? styles.textCheck : styles.textUncheck;
    return (
      <View style={styles.containerRowCheck}>
        <Icon icon="iconCheckCircle" size={14} tintColor={isCheckTintColor} style={styles.iconCheck} />
        <Text.BodyS style={isCheckStyle}>{text}</Text.BodyS>
      </View>
    );
  };

  const rules = {
    required: t('auth:text_err_password_blank'),
    validate: (value: string) => validateRules(value, form, setForm),
  };

  return (
    <>
      <Text.LabelM useI18n style={styleLabel}>
        {label}
      </Text.LabelM>
      <PasswordInputController
        style={styles.input}
        useFormData={useFormData}
        name={fieldName}
        rules={rules}
        loading={loading}
        testID="form_check_password.input"
        placeholder={t(placeholder)}
        validateValue={validateValue}
        textContentType="oneTimeCode"
      />
      {renderRowCheck(form?.isLimitCharacter, t('auth:text_err_password_characters'))}
      {renderRowCheck(form?.isUppercaseLetter, t('auth:text_err_password_required_upper_case'))}
      {isCheckLowercaseLetter
        && renderRowCheck(form?.isLowercaseLetter, t('auth:text_err_password_required_lower_case'))}
      {renderRowCheck(form?.isDigits, t('auth:text_err_password_required_number'))}
      {renderRowCheck(form?.isSpecialCharacter, t('auth:text_err_password_required_symbols'))}
    </>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    input: {
      marginTop: spacing.margin.small,
    },
    containerRowCheck: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.margin.tiny,
    },
    textCheck: {
      color: colors.neutral40,
    },
    textUncheck: {
      color: colors.neutral20,
    },
    iconCheck: {
      marginRight: spacing.margin.tiny,
    },
  });
};

export default FormCheckPassword;
