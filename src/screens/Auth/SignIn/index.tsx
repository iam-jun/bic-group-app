import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  AppState,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import Button from '~/beinComponents/Button';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import {createTextStyle} from '~/beinComponents/Text/textStyle';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

import {authStack} from '~/configs/navigator';
import * as validation from '~/constants/commonRegex';
import {useBaseHook} from '~/hooks';
import useAuth from '~/hooks/auth';
import useAuthAmplifyHub from '~/hooks/authAmplifyHub';
import images from '~/resources/images';
import * as modalActions from '~/store/modal/actions';
// import SignInOAuth from '../components/SignInOAuth';
import {ITheme} from '~/theme/interfaces';
import actions from '../redux/actions';
import {
  getUserFromSharedPreferences,
  isAppInstalled,
} from '~/services/sharePreferences';
import {getUserEmailFromChatCookie} from '~/utils/cookie';
import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';
import TextInputController from '~/beinComponents/inputs/TextInputController';
import {getEnv} from '~/utils/env';

const SignIn = () => {
  useAuthAmplifyHub();
  const {t} = useBaseHook();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {loading, signingInError} = useAuth();
  const [disableSignIn, setDisableSignIn] = useState(true);
  const [authSessions, setAuthSessions] = useState<any>(null);

  const inputPasswordRef = useRef<any>();

  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const isWeb = Platform.OS === 'web';
  const useFormData = useForm();
  const {
    control,
    formState: {errors},
    trigger,
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useFormData;

  useEffect(() => {
    checkAuthSessions();
    // avoid taking old loading state from store
    dispatch(actions.setLoading(false));
    dispatch(actions.setSigningInError(''));
    checkDisableSignIn();
    setDisableSignIn(true);

    const appStateChangeEvent = AppState.addEventListener(
      'change',
      checkAuthSessions,
    );

    if (isWeb) {
      document.addEventListener('visibilitychange', checkAuthSessions);
    }

    return () => {
      appStateChangeEvent.remove();
      if (isWeb) {
        document.removeEventListener('visibilitychange', checkAuthSessions);
      }
    };
  }, []);

  useEffect(() => {
    setDisableSignIn(loading);
  }, [loading]);

  useEffect(() => {
    if (signingInError) {
      setError('password', {
        type: 'validate',
        message: signingInError,
      });
      setError('email', {
        type: 'validate',
        message: signingInError,
      });
    } else {
      clearAllErrors();
    }
    checkDisableSignIn();
  }, [signingInError]);

  const checkAuthSessions = async () => {
    if (isWeb) {
      checkChatWebLogin();
      return;
    }

    const isInstalled = await isAppInstalled();
    if (isInstalled) {
      const user = await getUserFromSharedPreferences();
      setValue('email', user?.email);
      setAuthSessions(user);
    } else {
      setValue('email', '');
      setAuthSessions(null);
    }
  };

  const checkChatWebLogin = () => {
    const userEmail = getUserEmailFromChatCookie();
    setValue('email', userEmail);

    const newAuthSessions = userEmail === '' ? {} : {email: userEmail};
    setAuthSessions(newAuthSessions);
  };

  const clearAllErrors = () => {
    clearErrors('email');
    clearErrors('password');
  };

  const clearFieldError = (name: 'email' | 'password') => {
    const error = errors[name];
    if (!error) return;

    if (error.message === signingInError) clearAllErrors();
    else clearErrors(name);
  };

  const onSubmitEmail = () => {
    if (getValues('password')) {
      onSignIn();
      return;
    }

    inputPasswordRef?.current?.focus();
  };

  const onSignIn = async () => {
    if (disableSignIn) return; // Reject if pressing enter while having invalid inputs
    setDisableSignIn(true);

    const validInputs = await validateInputs();
    checkDisableSignIn();
    if (!validInputs) return;

    const email = getValues('email');
    const password = getValues('password');
    dispatch(actions.signIn({email, password}));
  };

  const validateInputs = async () => {
    const validEmail = await trigger('email');
    const validPassword = await trigger('password');
    return validEmail && validPassword;
  };

  const checkDisableSignIn = () => {
    const email = getValues('email');
    const password = getValues('password');
    const result = !isEmpty(errors) || !email || !password || loading;
    setDisableSignIn(result);
  };

  // TODO: remove when function signup come back
  const handleSignUpNotFunctioning = () => {
    dispatch(modalActions.showAlertNewFeature());
  };

  const hideKeyboard = () => {
    !isWeb && Keyboard.dismiss();
  };

  const goToForgotPassword = () =>
    navigation.navigate(authStack.forgotPassword);

  return (
    <ScreenWrapper testID="sign_in" style={styles.root} isFullView>
      <TouchableWithoutFeedback
        testID="sign_in.button_hide_keyboard"
        onPress={hideKeyboard}
        accessible={false}
        style={styles.flex1}>
        <View style={styles.container}>
          <View>
            <Image
              testID="sign_in.logo"
              resizeMode="contain"
              style={styles.logo}
              source={images.logo_bein}
            />
            <Text.H6 testID="sign_in.title" style={styles.title} useI18n>
              auth:text_sign_in_desc
            </Text.H6>
            <TextInputController
              testID="sign_in.input_email"
              useFormData={useFormData}
              name="email"
              rules={{
                required: t('auth:text_err_email_blank'),
                pattern: {
                  value: validation.emailRegex,
                  message: t('auth:text_err_email_format'),
                },
              }}
              validateValue={() => {
                clearFieldError('email');
                checkDisableSignIn();
              }}
              label={
                !isWeb && !loading ? t('auth:input_label_email') : undefined
              }
              placeholder={
                !isWeb ? 'sample@email.com' : t('auth:input_label_email')
              }
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.inputEmail}
              onSubmitEditing={onSubmitEmail}
              helperContent={signingInError}
            />
            <PasswordInputController
              ref={inputPasswordRef}
              useFormData={useFormData}
              testID="sign_in.input_password"
              name={'password'}
              rules={{
                required: t('auth:text_err_password_blank'),
                maxLength: {
                  value: 20,
                  message: t('auth:text_err_password_characters'),
                },
                minLength: {
                  value: 6,
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
              disableInput={loading}
              label={
                !isWeb && !loading ? t('auth:input_label_password') : undefined
              }
              placeholder={t('auth:input_label_password')}
              validateValue={() => {
                clearFieldError('password');
                checkDisableSignIn();
              }}
            />
            <View style={styles.forgotButton}>
              <TouchableOpacity
                testID="sign_in.btn_forgot_password"
                onPress={goToForgotPassword}>
                <Text.H6 style={styles.transparentButton} useI18n>
                  auth:btn_forgot_password
                </Text.H6>
              </TouchableOpacity>
            </View>
            <Button.Primary
              testID="sign_in.btn_login"
              style={styles.btnSignIn}
              disabled={disableSignIn}
              onPress={onSignIn}
              useI18n>
              {loading ? (
                <LoadingIndicator testID="sign_in.loading" />
              ) : (
                'auth:btn_sign_in'
              )}
            </Button.Primary>
          </View>
          {/*<Text.H5 style={styles.orText} useI18n>auth:text_or</Text.H5>*/}
          {/*<SignInOAuth />*/}
          <View style={styles.signUpContainer}>
            <Text.H6 useI18n>auth:text_sign_up_desc</Text.H6>
            <TouchableOpacity
              testID="btnSignInForgotPassword"
              // onPress={() => navigation.navigate(authStack.signup)}
              onPress={handleSignUpNotFunctioning}>
              <Text.H6 style={styles.transparentButton} useI18n>
                auth:btn_sign_up_now
              </Text.H6>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {spacing, colors} = theme;
  const textStyle = createTextStyle(theme);

  return StyleSheet.create({
    root: {
      flex: 1,
      paddingTop: insets.top,
      paddingHorizontal: spacing.padding.big,
      backgroundColor: colors.background,
      alignContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      alignContent: 'center',
      width: '100%',
      maxWidth: 375,
      ...Platform.select({
        web: {
          paddingTop: 15,
        },
      }),
    },
    flex1: {flex: 1},
    logo: {
      alignSelf: 'center',
      width: 64,
      height: 64,
      marginVertical: spacing.margin.big,
    },
    title: {
      marginVertical: spacing.margin.large,
    },
    inputEmail: {
      marginTop: 0,
      marginBottom: theme.spacing.margin.small,
    },
    inputPassword: {
      marginTop: 0,
      marginBottom: 0,
    },
    forgotButton: {
      alignSelf: 'flex-end',
      marginTop: spacing.margin.large,
      color: colors.primary7,
    },
    transparentButton: {
      marginLeft: spacing.margin.tiny,
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
