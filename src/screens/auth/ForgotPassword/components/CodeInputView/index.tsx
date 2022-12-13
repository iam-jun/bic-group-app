import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';

import Text from '~/baseComponents/Text';
import Button from '~/beinComponents/Button';
import * as validation from '~/constants/commonRegex';
import { useBaseHook } from '~/hooks';
import { IObject } from '~/interfaces/common';

import TextInputController from '~/beinComponents/inputs/TextInputController';
import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';
import getEnv from '~/utils/env';
import spacing from '~/theme/spacing';
import { APP_ENV } from '~/configs/appConfig';
import useForgotPasswordStore, { IForgotPasswordState } from '../../store';

interface Props {
  useFormData: IObject<any>;
}

const CodeInputView: React.FC<Props> = ({ useFormData }) => {
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const styles = themeStyles(theme);

  const actions = useForgotPasswordStore((state: IForgotPasswordState) => state.actions);
  const errorConfirm = useForgotPasswordStore((state: IForgotPasswordState) => state.errorConfirm);
  const loadingConfirm = useForgotPasswordStore((state: IForgotPasswordState) => state.loadingConfirm);
  const loadingRequest = useForgotPasswordStore((state: IForgotPasswordState) => state.loadingRequest);

  useEffect(
    () => {
      if (errorConfirm) {
        setError(
          'code', {
            type: 'manual',
            message: errorConfirm,
          },
        );
      } else {
        clearErrors('code');
      }
    }, [errorConfirm],
  );

  const {
    getValues,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
    trigger,
  } = useFormData;

  const checkDisableConfirm = () => {
    const code = getValues('code');
    const email = getValues('email');
    const newPassword = getValues('newPassword');
    const confirmPassword = getValues('confirmPassword');
    const passwordMatched = newPassword === confirmPassword;
    return (
      !isEmpty(errors)
      || !email
      || !code
      || !newPassword
      || !confirmPassword
      || !passwordMatched
      || loadingConfirm
    );
  };
  const disableConfirm = checkDisableConfirm();

  const checkDisableRequest = () => {
    const email = getValues('email');
    return loadingConfirm || !email || !isEmpty(errors.email);
  };
  const disableRequest = checkDisableRequest();

  const onConfirmForgotPassword = () => {
    const email = getValues('email');
    const code = getValues('code');
    const newPassword = getValues('newPassword');
    const confirmPassword = getValues('confirmPassword');
    if (
      email
      && code
      && newPassword
      && confirmPassword
      && newPassword === confirmPassword
      && !disableConfirm
    ) {
      actions.confirmForgotPassword({ email, code, password: newPassword });
    }
  };

  const onRequestForgotPassword = () => {
    const email = getValues('email');
    if (email && !disableRequest) {
      setValue(
        'code', '', { shouldValidate: false },
      );
      clearErrors('code');
      actions.requestResetPassword(email);
    }
  };

  const validateCode = async () => {
    await trigger('code');
  };

  const validateNewPassword = async () => {
    await trigger('newPassword');
  };

  const validateConfirmPassword = async () => {
    await trigger('confirmPassword');
    if (getValues('newPassword') !== getValues('confirmPassword')) {
      setError(
        'confirmPassword', {
          type: 'manual',
          message: t('auth:text_err_confirm_password_not_matched'),
        },
      );
    }
  };

  const _email = getValues('email');

  return (
    <View testID="forgot_password.confirm_view" style={styles.container}>
      <View style={styles.inputSectionContainer}>
        <Text.H6>{t('auth:text_forgot_password_input_code_title')}</Text.H6>
        <Text.BodyS style={styles.desc}>
          {t('auth:text_forgot_password_input_code_desc')?.replace?.(
            '(email)',
            _email,
          )}
        </Text.BodyS>
        <TextInputController
          testID="forgot_password.input_code"
          useFormData={useFormData}
          name="code"
          rules={{
            required: t('auth:text_err_code'),
            pattern: {
              value: validation.codeRegex,
              message: t('auth:text_err_code'),
            },
          }}
          validateValue={validateCode}
          placeholder={t('auth:input_label_code')}
          keyboardType="numeric"
        />
        <Text.BodyS>
          {t('auth:text_request_new_code')}
          {' '}
          <Text.BodySMedium
            onPress={onRequestForgotPassword}
            suppressHighlighting
            style={styles.highlightText}
            testID="forgot_password.button_resend_code"
          >
            {t('auth:btn_resend_code')}
            {loadingRequest
             && (
             <ActivityIndicator
               testID="forgot_password.button_resend_code.loading"
               color={theme.colors.neutral40}
               style={styles.loading}
               size={12}
             />
             )}
          </Text.BodySMedium>
        </Text.BodyS>
      </View>
      <View style={styles.inputSectionContainer}>
        <Text.H6 useI18n style={styles.newPasswordTitle}>
          auth:text_forgot_password_input_pw_title
        </Text.H6>
        <PasswordInputController
          useFormData={useFormData}
          name="newPassword"
          rules={{
            required: t('auth:text_err_password_blank'),
            maxLength: {
              value: 20,
              message: t('auth:text_err_password_characters'),
            },
            minLength: {
              value: 8,
              message: t('auth:text_err_password_characters'),
            },
            validate: () => {
              if (getEnv('APP_ENV') === APP_ENV.PRODUCTION) {
                const value = getValues('newPassword');
                if (!/(?=.*?[A-Z])/.test(value)) {
                  return t('auth:text_err_password_required_upper_case');
                }
                if (!/(?=.*?[a-z])/.test(value)) {
                  return t('auth:text_err_password_required_lower_case');
                }
                if (!/(?=.*?[0-9])/.test(value)) {
                  return t('auth:text_err_password_required_number');
                }
                if (!/(?=.*?[^\w\s])/.test(value)) {
                  return t('auth:text_err_password_required_symbols');
                }
              }
            },
          }}
          loading={loadingConfirm}
          testID="forgot_password.input_new_password"
          placeholder={t('auth:input_label_new_password')}
          validateValue={validateNewPassword}
          textContentType="oneTimeCode"
        />

        <PasswordInputController
          useFormData={useFormData}
          name="confirmPassword"
          rules={{
            required: t('auth:text_err_password_blank'),
          }}
          loading={loadingConfirm}
          testID="forgot_password.input_confirm_password"
          placeholder={t('auth:input_label_confirm_new_password')}
          validateValue={validateConfirmPassword}
          textContentType="oneTimeCode"
        />
      </View>
      <Button.Primary
        useI18n
        testID="forgot_password.button_change_password"
        disabled={disableConfirm}
        loading={loadingConfirm}
        onPress={onConfirmForgotPassword}
      >
        auth:btn_submit
      </Button.Primary>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: spacing.padding.big,
    },
    inputSectionContainer: {
      marginBottom: spacing.margin.base,
    },
    desc: {
      marginBottom: spacing.margin.base,
      marginTop: spacing.margin.tiny,
    },
    newPasswordTitle: {
      marginBottom: spacing.margin.small,
    },
    highlightText: {
      color: colors.gray70,
    },
    loading: {
      marginLeft: spacing.margin.small,
    },
  });
};

export default CodeInputView;
