import { Hub } from 'aws-amplify';
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
  Alert,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

import useAuthController, { IAuthState } from '~/screens/auth/store';
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
import LogoImage from '../components/LogoImage';
import getEnv from '~/utils/env';
import { APP_ENV } from '~/configs/appConfig';
import { AppConfig } from '~/configs';
import RequestVerifyEmailModal from '../VerifyEmail/RequestVerifyEmailModal';
import { authErrorMessage, authErrors } from '~/constants/authConstants';
import { useBaseHook } from '~/hooks';
import useModalStore from '~/store/modal';
import { FieldNameType } from '~/interfaces/IAuth';
import { POLICY_URL } from '~/constants/url';
import { openInAppBrowser } from '~/utils/link';

const { EMAIL, PASSWORD } = FieldNameType;

const SignIn = () => {
  const { rootNavigation } = useRootNavigation();
  const [disableSignIn, setDisableSignIn] = useState(true);
  const [authSessions, setAuthSessions] = useState<any>(null);

  const signInState = useAuthController((state: IAuthState) => state.signIn);
  const authActions = useAuthController((state: IAuthState) => state.actions);
  const loading = signInState?.loading;
  const signingInError = signInState?.error;

  const modalActions = useModalStore((state) => state.actions);

  const inputPasswordRef = useRef<any>();

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;
  const { t } = useBaseHook();

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
      authActions.setSignInLoading(false);
      authActions.setSignInError('');
      checkDisableSignIn();
      setDisableSignIn(true);

      const appStateChangeEvent = AppState.addEventListener(
        'change',
        checkAuthSessions,
      );

      Hub.listen('auth', authActions.handleAuthEvent);
      return () => {
        appStateChangeEvent.remove();
        Hub.remove('auth', authActions.handleAuthEvent);
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
          PASSWORD, {
            type: 'validate',
            message: signingInError,
          },
        );
        setError(
          EMAIL, {
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
    const email = getValues(EMAIL);
    const isInstalled = await isAppInstalled();
    if (isInstalled) {
      const user = await getUserFromSharedPreferences();
      const hasChatSession = user?.activeSessions?.chat;

      if (hasChatSession && user?.email && user?.email !== email) {
        setValue(EMAIL, user?.email);
        setAuthSessions(user);
      }
    } else {
      setAuthSessions(null);
    }
  };

  const clearAllErrors = () => {
    clearErrors(EMAIL);
    clearErrors(PASSWORD);
  };

  const clearFieldError = (name: FieldNameType) => {
    const error = errors[name];
    if (!error) return;

    if (error.message === signingInError) clearAllErrors();
    else clearErrors(name);
  };

  const onSubmitEmail = () => {
    if (getValues(PASSWORD)) {
      onSignIn();
      return;
    }

    inputPasswordRef?.current?.focus();
  };

  const handleCheckUser = (result: boolean, email: string) => {
    if (result) {
      modalActions.showModal({
        isOpen: true,
        titleFullScreen: 'groups:group_content:btn_your_groups',
        ContentComponent: <RequestVerifyEmailModal email={email} />,
      });
    } else {
      setError(EMAIL, {
        type: 'validate',
        message: t('auth:text_err_user_not_exist'),
      });
    }
  };

  const handleError = (error: any) => {
    let errorMessage;
    switch (error?.code) {
      case authErrors.NOT_AUTHORIZED_EXCEPTION:
        if (error?.message === authErrorMessage.USER_IS_DISABLED) {
          errorMessage = t('auth:text_err_user_deactivated');
        } else {
          errorMessage = t('auth:text_err_id_password_not_matched');
        }
        break;
      case authErrors.USER_NOT_FOUND_EXCEPTION:
        // eslint-disable-next-line no-case-declarations
        const email = getValues(EMAIL);
        authActions.checkIsUserNotVerified(email, (result: boolean) => { handleCheckUser(result, email); });
        break;
      default:
        errorMessage = error?.message || t('auth:text_err_id_password_not_matched');
    }
    authActions.setSignInLoading(false);
    modalActions.setLoadingModal(false);
    !!errorMessage && authActions.setSignInError(errorMessage);
  };

  const onSignIn = async () => {
    if (disableSignIn) return; // Reject if pressing enter while having invalid inputs
    setDisableSignIn(true);

    const validInputs = await validateInputs();
    checkDisableSignIn();
    if (!validInputs) return;

    Keyboard.dismiss();

    const email = getValues(EMAIL);
    const password = getValues(PASSWORD);
    authActions.signIn({ email, password }, handleError);
  };

  const validateInputs = async () => {
    const validEmail = await trigger(EMAIL);
    const validPassword = await trigger(PASSWORD);
    return validEmail && validPassword;
  };

  const checkDisableSignIn = () => {
    const email = getValues(EMAIL);
    const password = getValues(PASSWORD);
    const result = !isEmpty(errors) || !email || !password || loading;
    setDisableSignIn(result);
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const goToForgotPassword = () => rootNavigation.navigate(authStacks.forgotPassword);

  const onPrivacy = () => {
    openInAppBrowser(POLICY_URL);
  };

  const optionsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      loading ? 1 : 0, { duration: 500 },
    ),
  }));

  // for debugging, only supper users who logged in chat app can see
  const showAuthen = () => {
    const isProduction = getEnv('APP_ENV') === APP_ENV.PRODUCTION;

    if (isProduction && !AppConfig.superUsers.includes(authSessions?.email)) {
      return;
    }

    const json = JSON.stringify(authSessions, null, 2);

    Alert.alert(
      'Authentication',
      json,
    );
  };

  const renderLogoImage = () => (
    <LogoImage />
  );

  const renderDescription = () => (
    <Text.H3 testID="sign_in.title" color={colors.neutral80} style={styles.title} useI18n onPress={showAuthen}>
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

  const renderPrivacy = () => (
    <View style={styles.privacyContainer}>
      <Text.BodyMMedium color={colors.neutral30} useI18n style={styles.privacyText}>
        auth:text_agree_to_terms_sigin
      </Text.BodyMMedium>
      <Text.BodyMMedium onPress={onPrivacy} color={colors.neutral30} useI18n>
        auth:text_privacy_terms
      </Text.BodyMMedium>
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
            {renderPrivacy()}
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
    privacyContainer: {
      alignItems: 'center',
      marginTop: spacing.margin.extraLarge,
      flex: 1,
    },
    privacyText: {
      fontWeight: '400',
    },
  });
};

export default SignIn;
