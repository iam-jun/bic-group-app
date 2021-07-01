import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import {useDispatch} from 'react-redux';
import {useBaseHook} from '~/hooks';
import ScreenWrapper from '~/components/ScreenWrapper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import Input from '~/components/inputs';
import * as actions from '~/store/auth/actions';
import {Container, ViewSpacing} from '~/components';
import InputPassword from '~/components/inputs/InputPassword';
import {AuthProviders} from '~/constants/authProviders';
import * as refNavigator from '~/utils/refNavigator';
import {authStack} from '~/configs/navigator';
import * as validation from '~/constants/commonRegex';
import images from '~/resources/images';
import PrimaryButton from '~/components/buttons/PrimaryButton';
import Text from '~/components/texts/Text';
import useAuth from '~/hooks/auth';
import TransparentButton from '~/components/buttons/TransparentButton';

const SignIn = () => {
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
  const {loading} = useAuth();

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
    <ScreenWrapper
      testID="SignInScreen"
      style={styles.container}
      isFullView
      colorSecondary>
      <Container>
        <Image resizeMode="contain" style={styles.logo} source={images.Logo} />
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <Input
              testID="inputEmail"
              label={t('auth:input_label_email')}
              placeholder={t('auth:input_label_email')}
              autoCapitalize="none"
              secondaryBackground
              editable={!loading}
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
          defaultValue={__DEV__ && 'evol@mailinator.com'}
        />
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <InputPassword
              testID="inputPassword"
              label={t('auth:input_label_password')}
              placeholder={t('auth:input_label_password')}
              secondaryBackground
              error={errors.password}
              editable={!loading}
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
          defaultValue={__DEV__ && 'ABCxyz123@'}
        />
        <TransparentButton
          testID="textSignup"
          title={t('auth:navigate_sign_up')}
          onPress={() => refNavigator.navigate(authStack.signup)}
        />
        <ViewSpacing height={spacing.margin.base} />
        <TransparentButton
          testID="textForgotpassword"
          title={t('auth:text_forgot_password')}
          onPress={() => refNavigator.navigate(authStack.forgotpassword)}
        />
        <ViewSpacing height={spacing.margin.big} />
        <PrimaryButton
          testID="btnLogin"
          style={styles.button}
          disabled={loginDisable || loading}
          title={t('auth:btn_sign_in')}
          loading={loading}
          onPress={onSubmit}
        />
        <PrimaryButton
          testID="btnLoginFB"
          style={styles.button}
          title={t('auth:btn_sign_in_fb')}
          onPress={() => dispatch(actions.signInOAuth(AuthProviders.FACEBOOK))}
        />
        <PrimaryButton
          testID="btnLoginGG"
          style={styles.button}
          title={t('auth:btn_sign_in_gg')}
          onPress={() => dispatch(actions.signInOAuth(AuthProviders.GOOGLE))}
        />
      </Container>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignContent: 'center',
    },
    button: {
      marginBottom: spacing.margin.base,
    },
    logo: {
      width: '100%',
      height: 120,
      tintColor: colors.primary,
      marginTop: spacing.margin.big,
      marginBottom: 40,
    },
  });
};

export default SignIn;
