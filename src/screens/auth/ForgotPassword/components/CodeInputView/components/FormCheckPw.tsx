import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { IObject } from '~/interfaces/common';
import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';
import { IFormCheckPw } from '~/interfaces/IAuth';
import { useBaseHook } from '~/hooks';
import Text from '~/baseComponents/Text';
import { validate } from './helper';
import Icon from '~/baseComponents/Icon';

interface Props {
  useFormData: IObject<any>;
  loadingConfirm: boolean;
}

const FormCheckPw: React.FC<Props> = ({ useFormData, loadingConfirm }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();
  const styles = themeStyles(theme);
  const [form, setForm] = useState<IFormCheckPw>();

  const { trigger, getValues } = useFormData;

  const validateNewPassword = async () => {
    if (getValues('newPassword').length === 0) {
      setForm({
        isLimitCharacter: false,
        isUppercaseLetter: false,
        isDigits: false,
        isSpecialCharacter: false,
      });
    }
    await trigger('newPassword');
  };

  const renderRowCheck = (status: boolean, text: string) => {
    const isCheckTintColor = status ? colors.green50 : colors.neutral20;
    const isCheckStyle = status ? styles.textCheck : styles.textUncheck;
    return (
      <View style={styles.containerRowCheck}>
        <Icon icon="iconCheckCircle" size={14} tintColor={isCheckTintColor} style={styles.icon} />
        <Text.BodyS style={isCheckStyle}>{text}</Text.BodyS>
      </View>
    );
  };

  return (
    <>
      <PasswordInputController
        useFormData={useFormData}
        name="newPassword"
        rules={{
          required: t('auth:text_err_password_blank'),
          validate: (value: string) => validate(value, form, setForm),
        }}
        loading={loadingConfirm}
        testID="forgot_password.input_new_password"
        placeholder={t('auth:input_label_new_password')}
        validateValue={validateNewPassword}
        textContentType="oneTimeCode"
      />
      {renderRowCheck(form?.isLimitCharacter, t('auth:text_err_password_characters'))}
      {renderRowCheck(form?.isUppercaseLetter, t('auth:text_err_password_required_upper_case'))}
      {renderRowCheck(form?.isDigits, t('auth:text_err_password_required_number'))}
      {renderRowCheck(form?.isSpecialCharacter, t('auth:text_err_password_required_symbols'))}
    </>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    containerRowCheck: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    textCheck: {
      color: colors.neutral40,
    },
    textUncheck: {
      color: colors.neutral20,
    },
    icon: {
      marginRight: 4,
    },
  });
};

export default FormCheckPw;
