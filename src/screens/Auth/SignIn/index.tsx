import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  AppState,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Animated,
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
import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';
import TextInputController from '~/beinComponents/inputs/TextInputController';
import {getEnv} from '~/utils/env';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import BackgroundEntries1 from '../../../../assets/images/sign_in_bg_entries_1.svg';
import BackgroundEntries2 from '../../../../assets/images/sign_in_bg_entries_2.svg';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import LogoAnimated from '~/beinComponents/SVGAnimated/LogoAnimated';

const LOGO_SIZE = 96;
const LOGO_SMALL_SIZE = 48;

const SignIn = () => {
  useAuthAmplifyHub();
  const {t} = useBaseHook();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {loading, signingInError} = useAuth();
  const [disableSignIn, setDisableSignIn] = useState(true);
  const [authSessions, setAuthSessions] = useState<any>(null);

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [imageHeight, setImageHeight] = useState(LOGO_SIZE);

  const inputPasswordRef = useRef<any>();
  const imageHeightAnimation = new Animated.Value(LOGO_SIZE);
  const keyboardHeightAnimation = new Animated.Value(0);

  const theme: ITheme = useTheme() as ITheme;
  const styles = themeStyles(theme);

  const useFormData = useForm();
  const {
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

    return () => {
      appStateChangeEvent.remove();
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

  const showEvent =
    Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';

  const dismissEvent =
    Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

  keyboardHeightAnimation.addListener(height => {
    setKeyboardHeight(height.value);
  });
  imageHeightAnimation.addListener(height => {
    setImageHeight(height.value);
  });

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(showEvent, event => {
      if (event.endCoordinates?.height) {
        Animated.parallel([
          Animated.timing(keyboardHeightAnimation, {
            duration: event?.duration,
            useNativeDriver: false,
            toValue: event?.endCoordinates?.height,
          }),
          Animated.timing(imageHeightAnimation, {
            toValue: LOGO_SMALL_SIZE,
            useNativeDriver: false,
            duration: event?.duration,
          }),
        ]).start();
      }
    });
    const keyboardWillHideListener = Keyboard.addListener(
      dismissEvent,
      event => {
        Animated.parallel([
          Animated.timing(keyboardHeightAnimation, {
            duration: event?.duration,
            useNativeDriver: false,
            toValue: 0,
          }),
          Animated.timing(imageHeightAnimation, {
            toValue: LOGO_SIZE,
            useNativeDriver: false,
            duration: event?.duration,
          }),
        ]).start();
      },
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  const checkAuthSessions = async () => {
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
    Keyboard.dismiss();
  };

  const goToForgotPassword = () =>
    navigation.navigate(authStack.forgotPassword);

  return (
    <ScreenWrapper testID="sign_in" style={styles.root} isFullView>
      <ImageBackground source={images.img_bg_sign_in} style={styles.background}>
        <TouchableWithoutFeedback
          testID="sign_in.button_hide_keyboard"
          onPress={hideKeyboard}
          accessible={false}
          style={styles.flex1}>
          <Animated.View
            style={[styles.container, {marginBottom: keyboardHeight}]}>
            <View>
              <Animated.View style={[styles.logo]}>
                <LogoAnimated size={LOGO_SIZE} />
              </Animated.View>
              <View style={{backgroundColor: 'yellow'}} />
              <Text.H4 testID="sign_in.title" style={styles.title} useI18n>
                auth:text_sign_in_desc
              </Text.H4>
              <Text.Body style={styles.label} useI18n>
                auth:input_label_email
              </Text.Body>
              <TextInputController
                testID="sign_in.input_email"
                autoFocus={true}
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
                placeholder={'example@gmail.com'}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.inputEmailContainer}
                inputStyle={styles.input}
                helperContent={signingInError}
                disabled={!!authSessions || loading}
                onSubmitEditing={onSubmitEmail}
                placeholderTextColor={theme.colors.placeholder}
                textColor={theme.colors.background}
                outlineColor={theme.colors.background}
                activeOutlineColor={theme.colors.background}
              />
              <Text.Body style={styles.label} useI18n>
                auth:input_label_password
              </Text.Body>
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
                placeholder={t('auth:input_label_password_placeholder')}
                validateValue={() => {
                  clearFieldError('password');
                  checkDisableSignIn();
                }}
                onSubmitEditing={onSignIn}
                inputStyle={styles.input}
                style={styles.inputPassword}
                placeholderTextColor={theme.colors.placeholder}
                iconColor={theme.colors.background}
                textColor={theme.colors.background}
                outlineColor={theme.colors.background}
                activeOutlineColor={theme.colors.background}
              />
              <TouchableOpacity
                testID="sign_in.btn_forgot_password"
                onPress={goToForgotPassword}>
                <Text.BodyS style={styles.transparentButton} useI18n>
                  auth:btn_forgot_password
                </Text.BodyS>
              </TouchableOpacity>
              <Button.Primary
                testID="sign_in.btn_login"
                style={styles.btnSignIn}
                disabled={disableSignIn}
                onPress={onSignIn}
                useI18n
                color={theme.colors.background}
                textColor={theme.colors.primary6}>
                {loading ? (
                  <LoadingIndicator testID="sign_in.loading" />
                ) : (
                  'auth:btn_sign_in'
                )}
              </Button.Primary>
            </View>
            <View style={styles.signUpContainer}>
              <Text.Body color={theme.colors.background} useI18n>
                auth:text_sign_up_desc
              </Text.Body>
              <TouchableOpacity
                testID="btnSignInForgotPassword"
                // onPress={() => navigation.navigate(authStack.signup)}
                onPress={handleSignUpNotFunctioning}>
                <Text.H5 style={styles.transparentButton} useI18n>
                  auth:btn_sign_up_now
                </Text.H5>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View style={styles.bgEntries1}>
          <SVGIcon //@ts-ignore
            source={BackgroundEntries1}
            width={164}
            height={205}
            tintColor="none"
          />
        </View>
        <View pointerEvents="none" style={styles.bgEntries2}>
          <SVGIcon //@ts-ignore
            source={BackgroundEntries2}
            width={122}
            height={163}
            tintColor="none"
          />
        </View>
      </ImageBackground>
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
    },
    background: {
      flex: 1,
      paddingTop: insets.top,
      paddingHorizontal: spacing.padding.big,
      alignContent: 'center',
      alignItems: 'center',
    },
    bgEntries1: {position: 'absolute', right: 0, top: 0, flex: 1},
    bgEntries2: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      top: 0,
      right: 0,
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'stretch',
      alignContent: 'flex-start',
    },
    container: {
      flex: 1,
      alignContent: 'center',
      width: '100%',
      maxWidth: 375,
    },
    flex1: {flex: 1},
    logo: {
      alignItems: 'center',
      // paddingVertical: spacing.margin.extraLarge,
    },
    title: {
      marginTop: spacing.margin.extraLarge,
      marginBottom: spacing.margin.large,
      color: colors.background,
    },
    label: {
      color: colors.background,
    },
    inputEmailContainer: {
      marginTop: 0,
      marginBottom: spacing.margin.large,
    },
    input: {
      backgroundColor: colors.transparent,
    },
    inputPassword: {
      marginVertical: spacing.margin.small,
    },
    forgotButton: {
      color: colors.background,
    },
    transparentButton: {
      color: colors.background,
      fontWeight: '400',
    },
    orText: {
      fontWeight: '600',
    },
    btnSignIn: {
      marginTop: spacing.margin.large,
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      fontWeight: '400',
      marginTop: spacing.margin.extraLarge,
    },
    buttonSignupText: {
      ...textStyle.h6,
      color: colors.primary,
      fontWeight: '500',
    },
  });
};

export default SignIn;
