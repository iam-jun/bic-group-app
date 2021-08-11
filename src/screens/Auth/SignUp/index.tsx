import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import {useDispatch} from 'react-redux';
import {useBaseHook} from '~/hooks';

import TextInput from '~/beinComponents/inputs/TextInput';
import PasswordInput from '~/beinComponents/inputs/PasswordInput';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Button from '~/beinComponents/Button';
import {spacing} from '~/theme';
import * as actions from '~/screens/Auth/redux/actions';
import {authStack} from '~/configs/navigator';
import * as validation from '~/constants/commonRegex';
import useAuth from '~/hooks/auth';
import {rootNavigationRef} from '~/router/navigator/refs';
import {ITheme} from '~/theme/interfaces';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SignUp = () => {
  const dispatch = useDispatch();
  const {
    control,
    formState: {errors},
    trigger,
    setError,
    clearErrors,
    getValues,
  } = useForm();
  const theme: ITheme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const styles = themeStyles(theme);
  const {loading} = useAuth();

  const onSubmit = async () => {
    const email: string = getValues('email');
    const username: string = getValues('username');
    const password: string = getValues('password');
    await trigger();

    if (!isEmpty(errors)) return;
    dispatch(
      actions.signUp({
        username,
        password,
        email,
      }),
    );
  };

  const onUsernameChange = (
    value: string,
    onChange: (param: string) => void,
  ) => {
    onChange(value);
    validateUsername(value);
  };

  const validateUsername = debounce(value => {
    if (value.trim().length === 0) {
      setError('username', {
        type: 'required',
        message: t('auth:text_err_username_blank'),
      });
    } else {
      clearErrors('username');
    }
  }, 50);

  const validateEmail = debounce(async () => {
    await trigger('email');
  }, 50);

  const validatePassword = debounce(async () => {
    await trigger('password');
  }, 50);

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
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput
              testID="inputUsername"
              label={t('auth:input_label_username')}
              placeholder={t('auth:input_label_username')}
              autoCapitalize="none"
              value={value}
              editable={!loading}
              error={errors.username}
              onChangeText={text => onUsernameChange(text, onChange)}
              helperType="error"
              helperContent={errors?.username?.message}
            />
          )}
          rules={{required: t('auth:text_err_username_blank')}}
          name="username"
          defaultValue=""
        />

        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput
              testID="inputEmail"
              label={t('auth:input_label_email')}
              placeholder={t('auth:input_label_email')}
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              editable={!loading}
              error={errors.email}
              onChangeText={text => {
                onChange(text);
                validateEmail();
              }}
              helperType="error"
              helperContent={errors?.email?.message}
            />
          )}
          rules={{
            required: t('auth:text_err_email_blank'),
            pattern: {
              value: validation.emailRegex,
              message: t('auth:text_err_email_format'),
            },
          }}
          name="email"
        />

        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <PasswordInput
              testID="inputPassword"
              label={t('auth:input_label_password')}
              placeholder={t('auth:input_label_password')}
              error={errors.password}
              editable={!loading}
              value={value}
              onChangeText={text => {
                onChange(text);
                validatePassword();
              }}
              helperType="error"
              helperContent={errors?.password?.message}
            />
          )}
          name="password"
          rules={{
            required: t('auth:text_err_password_blank'),
            min: 8,
            max: 20,
            // pattern: {
            //   value: validation.passwordRegex,
            //   message: t('auth:text_err_password_format'),
            // },
          }}
        />
        <Button
          testID="textSignin"
          onPress={() => rootNavigationRef?.current?.navigate(authStack.login)}>
          {t('auth:navigate_sign_in')}
        </Button>
        <Button.Primary
          testID="btnSignUp"
          disabled={disableBtn || loading}
          loading={loading}
          onPress={onSubmit}>
          {t('auth:btn_sign_up')}
        </Button.Primary>
      </View>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {colors} = theme;

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top,
      paddingHorizontal: spacing.padding.big,
      alignContent: 'center',
      backgroundColor: colors.background,
    },
    button: {
      marginTop: spacing.margin.big,
    },
  });
};

export default SignUp;
