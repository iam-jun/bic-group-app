import {isEmpty} from 'lodash';
import React, {useEffect, useRef, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';

import Button from '~/beinComponents/Button';
import PasswordInput from '~/beinComponents/inputs/PasswordInput';
import Input from '~/beinComponents/inputs/TextInput';
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
import {deviceDimensions} from '~/theme/dimension';
// import SignInOAuth from '../components/SignInOAuth';
import {ITheme} from '~/theme/interfaces';
import * as actions from '../redux/actions';

const SignIn = () => {
  useAuthAmplifyHub();
  const {t} = useBaseHook();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {loading, signingInError} = useAuth();
  const [disableSignIn, setDisableSignIn] = useState(true);
  const dimensions = useWindowDimensions();

  const inputPasswordRef = useRef<any>();

  const theme: ITheme = useTheme() as ITheme;
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const styles = themeStyles(theme, isPhone);

  const isWeb = Platform.OS === 'web';

  const {
    control,
    formState: {errors},
    trigger,
    setError,
    clearErrors,
    getValues,
  } = useForm();

  useEffect(() => {
    // avoid taking old loading state from store
    dispatch(actions.setLoading(false));
    dispatch(actions.setSigningInError(''));
    checkDisableSignIn();
    setDisableSignIn(true);
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

  return (
    <ScreenWrapper testID="SignInScreen" style={styles.root} isFullView>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
        style={{flex: 1, backgroundColor: 'pink'}}>
        <View style={styles.container}>
          <View>
            <Image
              resizeMode="contain"
              style={styles.logo}
              source={images.logo_bein}
            />
            <Text.H6 style={styles.title} useI18n>
              auth:text_sign_in_desc
            </Text.H6>
            <Controller
              control={control}
              render={({field: {onChange, value}}) => (
                <Input
                  testID="inputEmail"
                  label={
                    !isWeb && !loading ? t('auth:input_label_email') : undefined
                  }
                  placeholder={
                    !isWeb ? 'sample@email.com' : t('auth:input_label_email')
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  disabled={loading}
                  value={value}
                  error={errors.email}
                  onChangeText={text => {
                    onChange(text);
                    clearFieldError('email');
                    checkDisableSignIn();
                  }}
                  onSubmitEditing={onSubmitEmail}
                  helperType={errors.email?.message ? 'error' : undefined}
                  helperContent={
                    errors?.email?.message === signingInError
                      ? ''
                      : errors?.email?.message
                  }
                  style={styles.inputEmail}
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
                  ref={inputPasswordRef}
                  label={
                    !isWeb && !loading
                      ? t('auth:input_label_password')
                      : undefined
                  }
                  placeholder={t('auth:input_label_password')}
                  error={errors.password}
                  autoCapitalize="none"
                  disabled={loading}
                  value={value}
                  onChangeText={text => {
                    onChange(text);
                    clearFieldError('password');
                    checkDisableSignIn();
                  }}
                  onSubmitEditing={() => onSignIn()}
                  helperType={errors.password?.message ? 'error' : undefined}
                  helperContent={errors?.password?.message}
                  style={styles.inputPassword}
                />
              )}
              name="password"
              rules={{
                required: t('auth:text_err_password_blank'),
                // min: 8,
                // max: 20,
                pattern: {
                  value: validation.passwordRegex,
                  message: t('auth:text_err_password_format'),
                },
              }}
            />
            <View style={styles.forgotButton}>
              <TouchableOpacity
                testID="btnSignInForgotPassword"
                onPress={() => navigation.navigate(authStack.forgotPassword)}>
                <Text.H6 style={styles.transparentButton} useI18n>
                  auth:btn_forgot_password
                </Text.H6>
              </TouchableOpacity>
            </View>
            <Button.Primary
              testID="btnLogin"
              style={styles.btnSignIn}
              disabled={disableSignIn}
              onPress={onSignIn}
              useI18n>
              {loading ? <LoadingIndicator /> : 'auth:btn_sign_in'}
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

const themeStyles = (theme: ITheme, isPhone: boolean) => {
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
      justifyContent: !isPhone ? 'center' : undefined,
    },
    container: {
      flex: 1,
      alignContent: 'center',
      width: '100%',
      maxWidth: 375,
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
