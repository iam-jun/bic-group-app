import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  AppState,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ImageBackground,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Modal, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useKeyboard} from '@react-native-community/hooks';

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
import BackgroundComponent from './BackgroundComponent';

const screenWidth = Dimensions.get('window').width;

const LOGO_SIZE = 96;
const LOGO_SMALL_SIZE = 48;
const MARGIN_LEFT_LOGO = -(screenWidth / 2 - 32 * 2);

const SignIn = () => {
  useAuthAmplifyHub();
  const {t} = useBaseHook();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {loading, signingInError} = useAuth();
  const [disableSignIn, setDisableSignIn] = useState(true);
  const [authSessions, setAuthSessions] = useState<any>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const inputPasswordRef = useRef<any>();
  const inputEmailRef = useRef<any>();
  const keyboardHeightValue = useSharedValue(0);
  const keyboard = useKeyboard();

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
    if (loading) Keyboard.dismiss();
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

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(showEvent, event => {
      if (event.endCoordinates?.height) {
        keyboardHeightValue.value = withTiming(
          1,
          {
            duration: 200,
          },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
        );
      }
    });
    const keyboardWillHideListener = Keyboard.addListener(
      dismissEvent,
      event => {
        keyboardHeightValue.value = withTiming(
          0,
          {
            duration: 200,
          },
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
        );
      },
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (
      keyboard?.keyboardHeight &&
      keyboardHeight !== keyboard?.keyboardHeight
    ) {
      setKeyboardHeight(keyboard?.keyboardHeight);
    }
  }, [keyboard?.keyboardHeight]);

  useEffect(() => {
    inputEmailRef.current?.focus();
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

    Keyboard.dismiss();

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

  const logoContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          keyboardHeightValue.value,
          [0, 1],
          [0, MARGIN_LEFT_LOGO],
          Extrapolate.CLAMP,
        ),
      },
    ],
    height: interpolate(
      keyboardHeightValue.value,
      [0, 1],
      [LOGO_SIZE, LOGO_SMALL_SIZE],
      Extrapolate.CLAMP,
    ),
    width: interpolate(
      keyboardHeightValue.value,
      [0, 1],
      [LOGO_SIZE, LOGO_SMALL_SIZE],
      Extrapolate.CLAMP,
    ),
  }));

  const renderLoading = () => {
    return (
      <Modal visible={loading} contentContainerStyle={styles.loading}>
        <LoadingIndicator size={'large'} color={theme.colors.primary6} />
      </Modal>
    );
  };

  return (
    <ScreenWrapper testID="sign_in" style={styles.root} isFullView>
      <BackgroundComponent>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">
          <TouchableWithoutFeedback
            testID="sign_in.button_hide_keyboard"
            onPress={hideKeyboard}
            accessible={false}
            style={styles.flex1}>
            <View style={styles.paddingView}>
              <Animated.Image
                source={images.logo_beincomm}
                style={[{alignSelf: 'center'}, logoContainerStyle]}
              />
              <View style={{backgroundColor: 'yellow'}} />
              <Text.H4 testID="sign_in.title" style={styles.title} useI18n>
                auth:text_sign_in_desc
              </Text.H4>
              <Text.Body style={styles.label} useI18n>
                auth:input_label_email
              </Text.Body>
              <TextInputController
                ref={inputEmailRef}
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
                placeholderTextColor={theme.colors.bgFocus}
                textColor={theme.colors.background}
                outlineColor={
                  errors?.email ? theme.colors.error : theme.colors.background
                }
                activeOutlineColor={theme.colors.background}
                helperTextProps={{
                  style: styles.errorText,
                }}
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
                placeholderTextColor={theme.colors.bgFocus}
                iconColor={theme.colors.background}
                textColor={theme.colors.background}
                outlineColor={theme.colors.background}
                activeOutlineColor={theme.colors.background}
                helperTextProps={{
                  style: styles.errorText,
                }}
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
                {'auth:btn_sign_in'}
              </Button.Primary>

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
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </BackgroundComponent>
      {renderLoading()}
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
    container: {
      flex: 1,
      alignContent: 'center',
      width: '100%',
      maxWidth: 375,
    },
    contentContainer: {
      flex: 1,
    },
    flex1: {flex: 1},
    paddingView: {
      flex: 1,
      paddingHorizontal: spacing.padding.extraLarge,
      paddingTop: spacing.padding.extraLarge,
    },
    smallLogo: {
      position: 'absolute',
      left: 0,
      width: LOGO_SMALL_SIZE,
      height: LOGO_SMALL_SIZE,
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
    errorText: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: spacing.padding.small,
      paddingVertical: spacing.padding.tiny,
      marginTop: spacing.margin.tiny,
    },
    loading: {
      position: 'absolute',
      zIndex: 3,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.transparent1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default SignIn;
