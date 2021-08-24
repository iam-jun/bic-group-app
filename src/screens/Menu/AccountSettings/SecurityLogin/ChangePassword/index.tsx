import React, {useEffect, useState} from 'react';
import _, {isEmpty} from 'lodash';
import debounce from 'lodash/debounce';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import Header from '~/beinComponents/Header';
import FlashMessage from '~/beinComponents/FlashMessage';
import PasswordInput from '~/beinComponents/inputs/PasswordInput';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import * as validation from '~/constants/commonRegex';
import {useRootNavigation} from '~/hooks/navigation';
import {useBaseHook} from '~/hooks';
import {
  changePassword,
  setChangePasswordError,
} from '~/screens/Auth/redux/actions';
import * as modalActions from '~/store/modal/actions';
import {ITheme} from '~/theme/interfaces';
import {IChangePasswordError} from '~/interfaces/IAuth';
import useAuth from '~/hooks/auth';

const ChangePassword = () => {
  const {t} = useBaseHook();
  const dispatch = useDispatch();
  const {rootNavigation} = useRootNavigation();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {changePasswordError, changePasswordLoading} = useAuth();
  const {errCurrentPassword, errBox}: IChangePasswordError =
    changePasswordError || {};
  const [disableSaveButton, setDisableSaveButton] = useState(true);

  useEffect(() => {
    dispatch(
      setChangePasswordError({
        errCurrentPassword: '',
      }),
    );
  }, []);

  useEffect(() => {
    console.log('Loading change', changePasswordLoading);
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

  const onClearErrorBox = () => {
    dispatch(setChangePasswordError({errBox: ''}));
  };

  const {
    control,
    formState: {errors},
    trigger,
    setError,
    clearErrors,
    getValues,
  } = useForm();

  const validatePassword = async () => {
    await trigger('password');
    if (getValues('password') === getValues('newPassword')) {
      setError('newPassword', {
        type: 'manual',
        message: t('auth:text_err_new_password_must_differ_from_current'),
      });
    } else if (errors['newPassword'].type === 'manual') {
      clearErrors('newPassword');
    }
  };

  const validateNewPassword = async () => {
    await trigger('newPassword');
    if (getValues('password') === getValues('newPassword')) {
      setError('newPassword', {
        type: 'manual',
        message: t('auth:text_err_new_password_must_differ_from_current'),
      });
    }
  };

  const validateConfirmNewPassword = async () => {
    await trigger('confirmNewPassword');
    if (getValues('newPassword') !== getValues('confirmNewPassword')) {
      setError('confirmNewPassword', {
        type: 'manual',
        message: t('auth:text_err_confirm_new_password_not_matched'),
      });
    }
  };

  const checkDisableSaveButton = debounce(async () => {
    const password = getValues('password');
    const newPassword = getValues('newPassword');
    const confirmNewPassword = getValues('confirmNewPassword');
    console.log('========================================');
    console.log('Error check', errors, ' => ', !isEmpty(errors));
    console.log('DEBUG 0:', password, newPassword, confirmNewPassword);
    const result =
      !isEmpty(errors) ||
      !password ||
      !newPassword ||
      !confirmNewPassword ||
      changePasswordLoading;
    console.log(
      'DEBUG 1:',
      result,
      !isEmpty(errors),
      !password,
      !newPassword,
      !confirmNewPassword,
      changePasswordLoading,
    );
    setDisableSaveButton(result);
  }, 10);

  const handleForgotPassword = () => {
    dispatch(
      modalActions.showAlert({
        title: 'Info',
        content:
          'Function has not been developed. Stay tuned for further releases 😀',
        onConfirm: () => dispatch(modalActions.hideAlert()),
        confirmLabel: 'Got it',
      }),
    );
  };

  // const [isCheckLogoutGlobal, setIsCheckLogoutGlobal] = useState(false);
  // const handleOnCheckLogoutGlobal = () => {
  //   setIsCheckLogoutGlobal(!isCheckLogoutGlobal);
  // };

  const handleOnSaveChangePassword = debounce(() => {
    if (!_.isEmpty(errors)) {
      return;
    }

    const oldPassword = getValues('password');
    const newPassword = getValues('confirmNewPassword');
    dispatch(changePassword({oldPassword, newPassword, global: false}));
  }, 500);

  return (
    <ScreenWrapper testID="SecurityLogin" isFullView>
      <Header title={t('settings:title_change_password')} />
      <View style={styles.container}>
        {!!errBox && (
          <FlashMessage
            type="error"
            onClose={onClearErrorBox}
            style={styles.flashMessage}>
            {errBox}
          </FlashMessage>
        )}
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <PasswordInput
              testID="inputPassword"
              label={t('auth:input_label_current_password')}
              placeholder={t('auth:input_label_current_password')}
              error={errors.password}
              autoCapitalize="none"
              editable={!changePasswordLoading}
              value={value || ''}
              onChangeText={text => {
                onChange(text);
                validatePassword();
                checkDisableSaveButton();
              }}
              helperType={errors.password?.message ? 'error' : undefined}
              helperContent={errors?.password?.message}
            />
          )}
          name="password"
          rules={{
            required: t('auth:text_err_password_blank'),
            pattern: {
              value: validation.passwordRegex,
              message: t('auth:text_err_password_format'),
            },
          }}
        />
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <PasswordInput
              testID="inputNewPassword"
              label={t('auth:input_label_new_password')}
              placeholder={t('auth:input_label_new_password')}
              error={errors.newPassword}
              autoCapitalize="none"
              editable={!changePasswordLoading}
              value={value || ''}
              onChangeText={text => {
                onChange(text);
                validateNewPassword();
                checkDisableSaveButton();
              }}
              helperType={errors.newPassword?.message ? 'error' : undefined}
              helperContent={errors?.newPassword?.message}
            />
          )}
          rules={{
            required: t('auth:text_err_new_password_blank'),
            pattern: {
              value: validation.passwordRegex,
              message: t('auth:text_err_password_format'),
            },
          }}
          name="newPassword"
          defaultValue=""
        />
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <PasswordInput
              testID="inputConfirmPassword"
              label={t('auth:input_label_confirm_new_password')}
              placeholder={t('auth:input_label_confirm_new_password')}
              error={errors.confirmNewPassword}
              autoCapitalize="none"
              editable={!changePasswordLoading}
              value={value || ''}
              onChangeText={text => {
                onChange(text);
                validateConfirmNewPassword();
                checkDisableSaveButton();
              }}
              helperType={
                errors.confirmNewPassword?.message ? 'error' : undefined
              }
              helperContent={errors?.confirmNewPassword?.message}
            />
          )}
          name="confirmNewPassword"
          rules={{
            required: t('auth:text_err_password_blank'),
          }}
          defaultValue=""
        />
        {/*<PrimaryItem*/}
        {/*  title={t('settings:title_logout_from_all_devices')}*/}
        {/*  style={styles.logoutFromAllDevices}*/}
        {/*  isChecked={isCheckLogoutGlobal}*/}
        {/*  onPressCheckbox={handleOnCheckLogoutGlobal}*/}
        {/*/>*/}
        <Button.Primary
          testID="btnChangePasswordSave"
          style={styles.btnSave}
          disabled={disableSaveButton}
          onPress={handleOnSaveChangePassword}>
          {t('common:text_save')}
        </Button.Primary>
        <Button.Secondary
          testID="btnCancelChangePassword"
          style={styles.btnCancel}
          onPress={() => rootNavigation.goBack()}>
          {t('common:btn_cancel')}
        </Button.Secondary>
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity
            testID="btnSignInForgotPassword"
            onPress={handleForgotPassword}>
            <Text.H6 style={styles.forgotPasswordText}>
              {t('auth:btn_forgot_password')}
            </Text.H6>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ChangePassword;

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: spacing.padding.large,
      paddingHorizontal: spacing.padding.base,
      alignContent: 'center',
    },
    flashMessage: {
      marginBottom: theme.spacing.margin.extraLarge,
    },
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
      color: colors.primary7,
    },
  });
};
