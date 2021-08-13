import React from 'react';
import {useTheme} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import debounce from 'lodash/debounce';

import {useBaseHook} from '~/hooks';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import Header from '~/beinComponents/Header';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import PasswordInput from '~/beinComponents/inputs/PasswordInput';
import PrimaryItem from '~/beinComponents/list/items/PrimaryItem';
import * as validation from '~/constants/commonRegex';
import {ITheme} from '~/theme/interfaces';

const ChangePassword = () => {
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {
    control,
    formState: {errors},
    trigger,
    setError,
    getValues,
  } = useForm();

  const validatePassword = debounce(async () => {
    await trigger('password');
  }, 50);

  const validateNewPassword = debounce(async () => {
    await trigger('newPassword');
    if (getValues('password') === getValues('newPassword')) {
      setError('newPassword', {
        type: 'manual',
        message: 'New password must not be the same as the current password',
      });
    }
  }, 50);

  const validateConfirmPassword = debounce(async () => {
    await trigger('confirmPassword');
    if (getValues('newPassword') !== getValues('confirmPassword')) {
      setError('confirmPassword', {
        type: 'manual',
        message: t('auth:text_err_confirm_password_not_matched'),
      });
    }
  }, 50);

  return (
    <ScreenWrapper testID="SecurityLogin" isFullView>
      <Header title={t('settings:title_change_password')} />
      <View style={styles.container}>
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <PasswordInput
              testID="inputPassword"
              label={t('auth:input_label_current_password')}
              placeholder={t('auth:input_label_current_password')}
              error={errors.password}
              autoCapitalize="none"
              value={value}
              onChangeText={text => {
                onChange(text);
                validatePassword();
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
              value={value}
              onChangeText={text => {
                onChange(text);
                validateNewPassword();
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
              error={errors.confirmPassword}
              autoCapitalize="none"
              value={value}
              onChangeText={text => {
                onChange(text);
                validateConfirmPassword();
              }}
              helperType={errors.confirmPassword?.message ? 'error' : undefined}
              helperContent={errors?.confirmPassword?.message}
            />
          )}
          name="confirmPassword"
          rules={{
            required: t('auth:text_err_password_blank'),
          }}
          defaultValue=""
        />
        <PrimaryItem
          title={t('settings:title_logout_from_all_devices')}
          style={styles.logoutFromAllDevices}
          onPressCheckbox={() =>
            alert('All of your devices will be logged out.')
          }
        />
        <Button.Primary testID="btnChangePasswordSave" style={styles.btnSave}>
          {t('common:text_save')}
        </Button.Primary>
        <Button.Secondary
          testID="btnCancelChangePassword"
          style={styles.btnCancel}>
          {t('common:btn_cancel')}
        </Button.Secondary>
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity testID="btnSignInForgotPassword">
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
