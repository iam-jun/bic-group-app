import React from 'react';
import {Button, StyleSheet, Text} from 'react-native';
import {useTheme, HelperText} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import {useDispatch} from 'react-redux';

import {useBaseHook} from '~/hooks';
import ThemeView from '~/theme/components/ThemeView';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme/configs';
import Input from '~/theme/components/Input';
import * as actions from '~/store/auth/actions';
import {ViewSpacing} from '~/theme/components';
import InputPassword from '~/theme/components/Input/InputPassword';
import {AuthProvider} from '~/constants/enum/AuthProvider';
import * as refNavigator from '~/utils/refNavigator';
import {authStack} from '~/configs/navigator';
import * as validation from '~/utils/validation';

const Login = () => {
  const dispatch = useDispatch();
  const {
    control,
    formState: {errors},
    trigger,
    getValues,
  } = useForm();
  const theme: IObject<any> = useTheme();
  const {t} = useBaseHook();
  const styles = themeStyles(theme);

  const onSubmit = async () => {
    const email = getValues('email');
    const password = getValues('password');
    await trigger();
    if (!isEmpty(errors)) return;
    dispatch(
      actions.signIn({
        email,
        password,
      }),
    );
  };

  const validateEmail = debounce(async () => {
    await trigger('email');
  }, 50);

  const validatePassword = debounce(async () => {
    await trigger('password');
  }, 50);

  const checkBtnLogin = () => {
    const email = getValues('email');
    const password = getValues('password');
    if (!isEmpty(errors) || !email || !password) return true;
    return false;
  };
  const loginDisable = checkBtnLogin();

  return (
    <ThemeView testID="SignInScreen" style={styles.container} isFullView>
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <Input
            testID="inputEmail"
            label={t('auth:input_label_email')}
            placeholder={t('auth:input_label_email')}
            autoCapitalize="none"
            value={value}
            error={errors.email}
            onChangeText={text => {
              onChange(text);
              validateEmail();
            }}
            helperType="error"
            helperContent={errors?.email?.message}
            helperVisible={errors.email}
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
        defaultValue=""
      />

      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <InputPassword
            testID="inputPassword"
            label={t('auth:input_label_password')}
            placeholder={t('auth:input_label_password')}
            error={errors.password}
            value={value}
            onChangeText={text => {
              onChange(text);
              validatePassword();
            }}
            helperType="error"
            helperContent={errors?.password?.message}
            helperVisible={errors.password}
          />
        )}
        name="password"
        rules={{required: t('auth:text_err_password_blank')}}
        defaultValue=""
      />

      <Text
        testID="textSignup"
        onPress={() => refNavigator.navigate(authStack.signup)}>
        {t('auth:navigate_sign_up')}
      </Text>

      <Text
        testID="textForgotpassword"
        onPress={() => refNavigator.navigate(authStack.forgotpassword)}>
        {t('auth:text_forgot_password')}
      </Text>
      <ViewSpacing height={80} />
      <Button
        testID="btnLogin"
        disabled={loginDisable}
        title={t('auth:btn_sign_in')}
        onPress={onSubmit}
      />
      <Button
        testID="btnLoginFB"
        title={t('auth:btn_sign_in_fb')}
        onPress={() => dispatch(actions.signInOAuth(AuthProvider.FACEBOOK))}
      />
      <Button
        testID="btnLoginGG"
        title={t('auth:btn_sign_in_gg')}
        onPress={() => dispatch(actions.signInOAuth(AuthProvider.GOOGLE))}
      />
    </ThemeView>
  );
};

const themeStyles = (theme: IObject<any>) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignContent: 'center',
    },
    button: {
      marginTop: spacing.margin.big,
    },
  });
};

export default Login;
