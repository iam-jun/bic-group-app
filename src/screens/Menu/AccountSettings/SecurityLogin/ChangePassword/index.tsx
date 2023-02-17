import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import { useBaseHook } from '~/hooks';

import spacing from '~/theme/spacing';
import Button from '~/beinComponents/Button';
import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';
import getEnv from '~/utils/env';
import { APP_ENV } from '~/configs/appConfig';
import useChangePasswordStore, { IChangePasswordState } from './store';

const ChangePassword = () => {
  const { t } = useBaseHook();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const actions = useChangePasswordStore((state: IChangePasswordState) => state.actions);
  const errorText = useChangePasswordStore((state: IChangePasswordState) => state.errorText);
  const loading = useChangePasswordStore((state: IChangePasswordState) => state.loading);

  const [disableSaveButton, setDisableSaveButton] = useState(true);

  useEffect(
    () => {
      actions.setErrorText();
    }, [],
  );

  useEffect(
    () => {
      checkDisableSaveButton();
    }, [loading],
  );

  useEffect(
    () => {
      if (errorText) {
        setError(
          'password', {
            type: 'manual',
            message: errorText,
          },
        );
      } else {
        clearErrors('password');
      }
    }, [errorText],
  );
  const useFormData = useForm();
  const {
    formState: { errors },
    trigger,
    setError,
    clearErrors,
    getValues,
  } = useFormData;

  const validatePassword = async () => {
    await trigger('password');
    compareCurrentWithNewPassword();
    checkDisableSaveButton();
  };

  const validateNewPassword = async () => {
    await trigger('newPassword');
    compareNewPasswordWithConfirmation();
    compareCurrentWithNewPassword();
    checkDisableSaveButton();
  };

  const validateConfirmNewPassword = async () => {
    await trigger('confirmNewPassword');
    compareNewPasswordWithConfirmation();
    checkDisableSaveButton();
  };

  const compareCurrentWithNewPassword = () => {
    if (getValues('password') === getValues('newPassword')) {
      setError(
        'newPassword', {
          type: 'manual',
          message: t('auth:text_err_new_password_must_differ_from_current'),
        },
      );
    } else if (errors.newPassword && errors.newPassword.type === 'manual') {
      clearErrors('newPassword');
    }
  };

  const compareNewPasswordWithConfirmation = () => {
    const confirmNewPassword = getValues('confirmNewPassword');
    if (!confirmNewPassword) return;
    const newPassword = getValues('newPassword');

    if (newPassword !== confirmNewPassword) {
      setError(
        'confirmNewPassword', {
          type: 'manual',
          message: t('auth:text_err_confirm_new_password_not_matched'),
        },
      );
    } else {
      clearErrors('confirmNewPassword');
    }
  };

  const checkDisableSaveButton = () => {
    const password = getValues('password');
    const newPassword = getValues('newPassword');
    const confirmNewPassword = getValues('confirmNewPassword');
    const result = !isEmpty(errors)
      || !password
      || !newPassword
      || !confirmNewPassword
      || loading;
    setDisableSaveButton(result);
  };

  const handleOnSaveChangePassword = async () => {
    await checkDisableSaveButton();
    if (disableSaveButton) {
      return;
    }

    const oldPassword = getValues('password');
    const newPassword = getValues('confirmNewPassword');
    actions.changePassword({ oldPassword, newPassword, global: false });
  };

  return (
    <ScreenWrapper testID="SecurityLogin" isFullView>
      <Header title={t('settings:title_change_password')} />
      <View style={styles.container}>
        <PasswordInputController
          testID="change_password.current_password"
          useFormData={useFormData}
          name="password"
          rules={{
            required: t('auth:text_err_password_blank'),
          }}
          label={t('auth:input_label_current_password')}
          placeholder={t('auth:input_label_current_password')}
          validateValue={validatePassword}
          autoComplete="off"
        />
        <PasswordInputController
          testID="change_password.new_password"
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
          loading={loading}
          label={t('auth:input_label_new_password')}
          placeholder={t('auth:input_label_new_password')}
          validateValue={validateNewPassword}
          autoComplete="off"
          onSubmitEditing={handleOnSaveChangePassword}
        />
        <PasswordInputController
          testID="change_password.confirm_password"
          useFormData={useFormData}
          name="confirmNewPassword"
          rules={{
            required: t('auth:text_err_password_blank'),
          }}
          loading={loading}
          label={t('auth:input_label_confirm_new_password')}
          placeholder={t('auth:input_label_confirm_new_password')}
          autoComplete="off"
          validateValue={validateConfirmNewPassword}
          onSubmitEditing={handleOnSaveChangePassword}
        />
        <Button.Primary
          testID="change_password.save"
          style={styles.btnSave}
          disabled={disableSaveButton}
          onPress={handleOnSaveChangePassword}
        >
          {t('common:text_save')}
        </Button.Primary>
        {/* <View style={styles.forgotPasswordContainer}> */}
        {/*  <TouchableOpacity onPress={handleForgotPassword}> */}
        {/*    <Text.H6 */}
        {/*      testID="change_password.forgot_password" */}
        {/*      style={styles.forgotPasswordText} */}
        {/*    > */}
        {/*      {t('auth:btn_forgot_password')} */}
        {/*    </Text.H6> */}
        {/*  </TouchableOpacity> */}
        {/* </View> */}
      </View>
    </ScreenWrapper>
  );
};

export default ChangePassword;

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: spacing.padding.large,
      paddingHorizontal: spacing.padding.base,
      alignContent: 'center',
    },
    btnSave: {
      marginTop: spacing.margin.tiny,
      height: 44,
    },
    btnCancel: {
      marginTop: spacing.margin.base,
      height: 36,
    },
    forgotPasswordContainer: {
      marginTop: spacing.margin.large,
      alignItems: 'center',
    },
    forgotPasswordText: {
      color: colors.purple60,
    },
  });
};
