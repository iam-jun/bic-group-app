import isEmpty from 'lodash/isEmpty';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Button from '~/beinComponents/Button';
import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';

import TextInputController from '~/beinComponents/inputs/TextInputController';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import * as validation from '~/constants/commonRegex';
import { useBaseHook } from '~/hooks';
import useAuth from '~/hooks/auth';
import { rootNavigationRef } from '~/router/refs';
import actions from '~/storeRedux/auth/actions';

import spacing from '~/theme/spacing';
import getEnv from '~/utils/env';
import { APP_ENV } from '~/configs/appConfig';
import authStacks from '~/router/navigator/AuthStack/stack';

const SignUp = () => {
  const dispatch = useDispatch();
  const useFormData = useForm();

  const {
    formState: { errors },
    trigger,
    setError,
    clearErrors,
    getValues,
  } = useFormData;
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const styles = themeStyles(theme);
  const { loading } = useAuth();

  const onSubmit = async () => {
    const email: string = getValues('email');
    const username: string = getValues('username');
    const password: string = getValues('password');
    await trigger();

    if (!isEmpty(errors)) return;
    dispatch(actions.signUp({
      username,
      password,
      email,
    }));
  };

  const validateUsername = async (value: string) => {
    if (value.trim().length === 0) {
      setError(
        'username', {
          type: 'required',
          message: t('auth:text_err_username_blank'),
        },
      );
    } else {
      clearErrors('username');
    }
  };

  const validateEmail = async () => {
    await trigger('email');
  };

  const validatePassword = async () => {
    await trigger('password');
  };

  const checkDisableBtn = () => {
    const email: string = getValues('email');
    const username: string = getValues('username');
    const password: string = getValues('password');
    return !isEmpty(errors) || !email || !username || !password;
  };
  const disableBtn = checkDisableBtn();

  return (
    <ScreenWrapper testID="SignUpScreen" style={styles.container} isFullView>
      <View>
        <TextInputController
          testID="inputUsername"
          label={t('auth:input_label_username')}
          placeholder={t('auth:input_label_username')}
          autoCapitalize="none"
          useFormData={useFormData}
          rules={{ required: t('auth:text_err_username_blank') }}
          name="username"
          validateValue={validateUsername}
          editable={loading}
        />

        <TextInputController
          testID="inputEmail"
          label={t('auth:input_label_email')}
          placeholder={t('auth:input_label_email')}
          autoCapitalize="none"
          keyboardType="email-address"
          useFormData={useFormData}
          name="email"
          rules={{
            required: t('auth:text_err_email_blank'),
            pattern: {
              value: validation.emailRegex,
              message: t('auth:text_err_email_format'),
            },
          }}
          validateValue={validateEmail}
          editable={loading}
        />
        <PasswordInputController
          useFormData={useFormData}
          name="password"
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
          loading={loading}
          testID="inputPassword"
          placeholder={t('auth:input_label_password')}
          validateValue={validatePassword}
        />
        <Button
          testID="textSignin"
          onPress={() => rootNavigationRef?.current?.navigate(authStacks.signIn)}
        >
          {t('auth:navigate_sign_in')}
        </Button>
        <Button.Primary
          testID="btnSignUp"
          disabled={disableBtn || loading}
          loading={loading}
          onPress={onSubmit}
        >
          {t('auth:btn_sign_up')}
        </Button.Primary>
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const insets = useSafeAreaInsets();
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top,
      paddingHorizontal: spacing.padding.big,
      alignContent: 'center',
      backgroundColor: colors.white,
    },
    button: {
      marginTop: spacing.margin.big,
    },
  });
};

export default SignUp;
