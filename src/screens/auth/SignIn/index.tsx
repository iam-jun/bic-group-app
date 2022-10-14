import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AppState,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/beinComponents/Text';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

import useAuth from '~/hooks/auth';
import useAuthAmplifyHub from '~/hooks/authAmplifyHub';
import * as modalActions from '~/storeRedux/modal/actions';
import actions from '../../../storeRedux/auth/actions';
import {
  getUserFromSharedPreferences,
  isAppInstalled,
} from '~/services/sharePreferences';
import spacing from '~/theme/spacing';
import { useRootNavigation } from '~/hooks/navigation';
import authStacks from '~/router/navigator/AuthStack/stack';
import { Button } from '~/baseComponents';
import InputEmail from './components/InputEmail';
import InputPassword from './components/InputPassword';
import LogoImage from './components/LogoImage';

const SignIn = () => {
  useAuthAmplifyHub();
  const { rootNavigation } = useRootNavigation();
  const dispatch = useDispatch();
  const { loading, signingInError } = useAuth();
  const [disableSignIn, setDisableSignIn] = useState(true);
  const [authSessions, setAuthSessions] = useState<any>(null);

  const inputPasswordRef = useRef<any>();

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;

  const useFormData = useForm();
  const {
    formState: { errors },
    trigger,
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useFormData;

  useEffect(
    () => {
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
    }, [],
  );

  useEffect(
    () => {
      setDisableSignIn(loading);
      if (loading) Keyboard.dismiss();
    }, [loading],
  );

  useEffect(
    () => {
      if (signingInError) {
        setError(
          'password', {
            type: 'validate',
            message: signingInError,
          },
        );
        setError(
          'email', {
            type: 'validate',
            message: signingInError,
          },
        );
      } else {
        clearAllErrors();
      }
      checkDisableSignIn();
    }, [signingInError],
  );

  const checkAuthSessions = async () => {
    const email = getValues('email');
    if (!!email) return;

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
    dispatch(actions.signIn({ email, password }));
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

  const goToForgotPassword = () => rootNavigation.navigate(authStacks.forgotPassword);

  const optionsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      loading ? 1 : 0, { duration: 500 },
    ),
  }));

  const renderLogoImage = () => (
    <LogoImage />
  );

  const renderDescription = () => (
    <Text.H3 testID="sign_in.title" color={colors.neutral80} style={styles.title} useI18n>
      auth:text_sign_in_welcome_back
    </Text.H3>
  );

  const renderInputEmail = () => (
    <InputEmail
      useFormData={useFormData}
      signingInError={signingInError}
      loading={loading}
      authSessions={authSessions}
      clearFieldError={clearFieldError}
      checkDisableSignIn={checkDisableSignIn}
      onSubmitEmail={onSubmitEmail}
    />
  );

  const renderInputPassword = () => (
    <InputPassword
      inputPasswordRef={inputPasswordRef}
      useFormData={useFormData}
      loading={loading}
      clearFieldError={clearFieldError}
      checkDisableSignIn={checkDisableSignIn}
      onSignIn={onSignIn}
    />
  );

  const renderForgotPassword = () => (
    <TouchableOpacity
      testID="sign_in.btn_forgot_password"
      style={styles.forgotPassword}
      onPress={goToForgotPassword}
    >
      <Text.BodyS color={colors.blue50} useI18n>
        auth:btn_forgot_password
      </Text.BodyS>
    </TouchableOpacity>
  );

  const renderButtonSignIn = () => (
    <Button.Primary
      testID="sign_in.btn_login"
      style={styles.btnSignIn}
      size="large"
      type="solid"
      disabled={disableSignIn}
      onPress={onSignIn}
      useI18n
    >
      auth:btn_sign_in
    </Button.Primary>
  );

  const renderSignUp = () => (
    <View style={styles.signUpContainer}>
      <Text.BodyS color={theme.colors.neutral40} useI18n>
        auth:text_sign_up_desc
      </Text.BodyS>
      <TouchableOpacity
        testID="btnSignInForgotPassword"
        // onPress={() => navigation.navigate(authStack.signup)}
        onPress={handleSignUpNotFunctioning}
      >
        <Text.BodySMedium color={colors.blue50} useI18n>
          auth:btn_sign_up_now
        </Text.BodySMedium>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => {
    if (!loading) return null;
    return (
      <Animated.View testID="sign_in.loading" style={[styles.loading, optionsStyle]}>
        <LoadingIndicator size="large" color={theme.colors.purple50} />
      </Animated.View>
    );
  };

  return (
    <ScreenWrapper testID="sign_in" style={styles.root} isFullView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback
          testID="sign_in.button_hide_keyboard"
          onPress={hideKeyboard}
          accessible={false}
          style={styles.flex1}
        >
          <View style={styles.paddingView}>
            {renderLogoImage()}
            {renderDescription()}
            {renderInputEmail()}
            {renderInputPassword()}
            {renderForgotPassword()}
            {renderButtonSignIn()}
            {renderSignUp()}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      {renderLoading()}
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      paddingTop: insets.top,
      alignContent: 'center',
      width: '100%',
    },
    contentContainer: {
      flex: 1,
    },
    flex1: { flex: 1 },
    paddingView: {
      flex: 1,
      paddingHorizontal: spacing.padding.big,
      paddingTop: spacing.padding.extraLarge,
    },
    title: {
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.extraLarge,
    },
    btnSignIn: {
      marginTop: spacing.margin.big,
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.margin.base,
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
    forgotPassword: {
      marginTop: spacing.margin.base,
    },
  });
};

export default SignIn;
