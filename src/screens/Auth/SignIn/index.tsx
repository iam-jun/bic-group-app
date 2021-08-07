import React, {useEffect} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {useForm, Controller} from 'react-hook-form';
import {isEmpty, debounce} from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {authStack} from '~/configs/navigator';
import * as validation from '~/constants/commonRegex';
import images from '~/resources/images';
import * as actions from '../redux/actions';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Input from '~/beinComponents/inputs/TextInput';
import PasswordInput from '~/beinComponents/inputs/PasswordInput';
import {createStyle as createTextStyle} from '~/beinComponents/Text/textStyle';
import {useBaseHook} from '~/hooks';
import useAuth from '~/hooks/auth';
import useAuthAmplifyHub from '~/hooks/authAmplifyHub';
// import SignInOAuth from '../components/SignInOAuth';
import {ITheme} from '~/theme/interfaces';
import * as modalActions from '~/store/modal/actions';
import AlertModal from '~/beinComponents/modals/AlertModal';

const SignIn = () => {
  useAuthAmplifyHub();
  const {t, navigation} = useBaseHook();
  const dispatch = useDispatch();
  const {loading, signingInError} = useAuth();

  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const {
    control,
    formState: {errors},
    trigger,
    setError,
    clearErrors,
    getValues,
  } = useForm();

  useEffect(() => {
    const email = getValues('email');
    if (email) {
      trigger().then(() => {
        // do nothing
      });
    }
  }, []);

  useEffect(() => {
    if (signingInError) {
      setError('password', {
        type: 'required',
        message: signingInError,
      });
    } else {
      clearErrors('password');
    }
  }, [signingInError]);

  const onSignIn = async () => {
    if (disableSignIn) {
      return;
    }
    const email = getValues('email');
    const password = getValues('password');
    dispatch(actions.signIn({email, password}));
  };

  const validateEmail = debounce(async () => {
    await trigger('email');
  }, 50);

  const validatePassword = debounce(async () => {
    await trigger('password');
  }, 50);

  const checkDisableSignIn = () => {
    return false; // TODO: disable for login with admin
    const email = getValues('email');
    const password = getValues('password');
    return !isEmpty(errors) || !email || !password || loading;
  };

  const disableSignIn = checkDisableSignIn();

  // TODO: remove when function signup come back
  const handleSignUpNotFunctioning = () => {
    dispatch(
      modalActions.showAlert({
        title: 'Info',
        content:
          'Function sign up has not been developed. Stay tuned for further releases 😀',
        onConfirm: () => dispatch(modalActions.hideAlert()),
        confirmLabel: 'Got it',
      }),
    );
  };

  return (
    <ScreenWrapper testID="SignInScreen" style={styles.container} isFullView>
      <View>
        <Image
          resizeMode="contain"
          style={styles.logo}
          source={images.logo_bein}
        />
        <Text.H6 style={styles.title}>{t('auth:text_sign_in_desc')}</Text.H6>
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <Input
              testID="inputEmail"
              label={t('auth:input_label_email')}
              placeholder={t('auth:input_label_email')}
              autoCapitalize="none"
              editable={!loading}
              value={value}
              error={errors.email}
              onChangeText={text => {
                onChange(text);
                validateEmail();
              }}
              helperType={errors.email?.message ? 'error' : undefined}
              helperContent={errors?.email?.message}
              style={{marginTop: 0, marginBottom: theme.spacing.margin.small}}
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
          defaultValue={__DEV__ && 'fe.admin'}
        />
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <PasswordInput
              testID="inputPassword"
              label={t('auth:input_label_password')}
              secureTextEntry={true}
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
              style={{marginTop: 0, marginBottom: 0}}
            />
          )}
          name="password"
          rules={{
            required: t('auth:text_err_password_blank'),
            min: 8,
            max: 20,
            pattern: {
              value: validation.passwordRegex,
              message: t('auth:text_err_password_format'),
            },
          }}
          defaultValue={__DEV__ && 'ABCxyz123@'}
        />
        <View style={styles.forgotButton}>
          <TouchableOpacity
            testID="btnSignInForgotPassword"
            onPress={() => navigation.navigate(authStack.forgotPassword)}>
            <Text.H6 style={styles.pressableText}>
              {t('auth:btn_forgot_password')}
            </Text.H6>
          </TouchableOpacity>
        </View>
        <Button.Primary
          testID="btnLogin"
          style={styles.btnSignIn}
          disabled={disableSignIn}
          onPress={onSignIn}>
          {t('auth:btn_sign_in')}
        </Button.Primary>
      </View>
      {/*<Container*/}
      {/*  style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>*/}
      {/*  <Text.H5 style={styles.orText}>{t('auth:text_or')}</Text.H5>*/}
      {/*</Container>*/}
      {/*<SignInOAuth />*/}
      <View style={styles.signUpContainer}>
        <Text.H6>{t('auth:text_sign_up_desc')} </Text.H6>
        <TouchableOpacity
          testID="btnSignInForgotPassword"
          // onPress={() => navigation.navigate(authStack.signup)}
          onPress={handleSignUpNotFunctioning}>
          <Text.H6 style={styles.pressableText}>
            {t('auth:btn_sign_up_now')}
          </Text.H6>
        </TouchableOpacity>
      </View>
      <AlertModal dismissable={true} />
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {spacing, colors} = theme;
  const textStyle = createTextStyle(theme);

  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top,
      paddingHorizontal: spacing.padding.big,
      alignContent: 'center',
    },
    logo: {
      alignSelf: 'center',
      width: 64,
      height: 64,
      marginVertical: spacing.margin.big,
    },
    title: {
      marginVertical: spacing.margin.large,
    },
    forgotButton: {
      alignSelf: 'flex-end',
      marginTop: spacing.margin.large,
      color: colors.primary7,
    },
    pressableText: {
      color: colors.primary7,
    },
    orText: {
      fontWeight: '600',
    },
    btnSignIn: {
      marginVertical: spacing.margin.extraLarge,
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      fontWeight: '400',
    },
    buttonSignupText: {
      ...textStyle.h6,
      color: colors.primary,
      fontWeight: '500',
    },
  });
};

export default SignIn;
