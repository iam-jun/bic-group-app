import React, {useEffect, useState} from 'react';
import {isEmpty} from 'lodash';
import {useForm} from 'react-hook-form';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import * as validation from '~/constants/commonRegex';
import {useBaseHook} from '~/hooks';
import authActions from '~/screens/Auth/redux/actions';
import * as modalActions from '~/store/modal/actions';

import {IChangePasswordError} from '~/interfaces/IAuth';
import useAuth from '~/hooks/auth';
import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';
import {getEnv} from '~/utils/env';
import spacing from '~/theme/spacing';

const ChangePassword = () => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);

  const {changePasswordError, changePasswordLoading} = useAuth();
  const {errCurrentPassword}: IChangePasswordError = changePasswordError || {};
  const [disableSaveButton, setDisableSaveButton] = useState(true);

  useEffect(() => {
    dispatch(
      authActions.setChangePasswordError({
        errCurrentPassword: '',
      }),
    );
  }, []);

  useEffect(() => {
    checkDisableSaveButton();
  }, [changePasswordLoading]);

  useEffect(() => {
    if (errCurrentPassword) {
      setError('password', {
        type: 'manual',
        message: errCurrentPassword,
      });
    } else {
      clearErrors('password');
    }
  }, [errCurrentPassword]);
  const useFormData = useForm();
  const {
    control,
    formState: {errors},
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
      setError('newPassword', {
        type: 'manual',
        message: t('auth:text_err_new_password_must_differ_from_current'),
      });
    } else if (errors.newPassword && errors.newPassword.type === 'manual') {
      clearErrors('newPassword');
    }
  };

  const compareNewPasswordWithConfirmation = () => {
    const confirmNewPassword = getValues('confirmNewPassword');
    if (!confirmNewPassword) return;
    const newPassword = getValues('newPassword');

    if (newPassword !== confirmNewPassword) {
      setError('confirmNewPassword', {
        type: 'manual',
        message: t('auth:text_err_confirm_new_password_not_matched'),
      });
    } else {
      clearErrors('confirmNewPassword');
    }
  };

  const checkDisableSaveButton = () => {
    const password = getValues('password');
    const newPassword = getValues('newPassword');
    const confirmNewPassword = getValues('confirmNewPassword');
    const result =
      !isEmpty(errors) ||
      !password ||
      !newPassword ||
      !confirmNewPassword ||
      changePasswordLoading;
    setDisableSaveButton(result);
  };

  const handleForgotPassword = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const handleOnSaveChangePassword = async () => {
    await checkDisableSaveButton();
    if (disableSaveButton) {
      return;
    }

    const oldPassword = getValues('password');
    const newPassword = getValues('confirmNewPassword');
    dispatch(
      authActions.changePassword({oldPassword, newPassword, global: false}),
    );
  };

  return (
    <ScreenWrapper testID="SecurityLogin" isFullView>
      <Header title={t('settings:title_change_password')} />
      <View style={styles.container}>
        <PasswordInputController
          testID="change_password.current_password"
          useFormData={useFormData}
          name={'password'}
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
              if (
                !getEnv('SELF_DOMAIN')?.includes('sbx') &&
                !getEnv('SELF_DOMAIN')?.includes('stg')
              ) {
                const value = getValues('password');
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
          label={t('auth:input_label_current_password')}
          placeholder={t('auth:input_label_current_password')}
          validateValue={validatePassword}
          autoComplete="off"
        />
        <PasswordInputController
          testID="change_password.new_password"
          useFormData={useFormData}
          name={'newPassword'}
          rules={{
            required: t('auth:text_err_password_blank'),
          }}
          loading={changePasswordLoading}
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
          loading={changePasswordLoading}
          label={t('auth:input_label_confirm_new_password')}
          placeholder={t('auth:input_label_confirm_new_password')}
          autoComplete="off"
          validateValue={validateConfirmNewPassword}
          onSubmitEditing={handleOnSaveChangePassword}
        />
        {/*<PrimaryItem*/}
        {/*  title={t('settings:title_logout_from_all_devices')}*/}
        {/*  style={styles.logoutFromAllDevices}*/}
        {/*  isChecked={isCheckLogoutGlobal}*/}
        {/*  onPressCheckbox={handleOnCheckLogoutGlobal}*/}
        {/*/>*/}
        <Button.Primary
          testID="change_password.save"
          style={styles.btnSave}
          disabled={disableSaveButton}
          onPress={handleOnSaveChangePassword}>
          {t('common:text_save')}
        </Button.Primary>
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text.H6
              testID="change_password.forgot_password"
              style={styles.forgotPasswordText}>
              {t('auth:btn_forgot_password')}
            </Text.H6>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ChangePassword;

const themeStyles = (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: spacing.padding.large,
      paddingHorizontal: spacing.padding.base,
      alignContent: 'center',
    },
    // flashMessage: {
    //   marginBottom: theme.spacing.margin.extraLarge,
    // },
    logoutFromAllDevices: {
      marginVertical: spacing.margin.tiny,
      height: 40,
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
