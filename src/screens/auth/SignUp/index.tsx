import { isEmpty } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import { ExtendedTheme, useFocusEffect, useTheme } from '@react-navigation/native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { t } from 'i18next';
import ScreenWrapper from '~/baseComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';
import LoadingIndicator from '~/beinComponents/LoadingIndicator';

import useAuthController, { IAuthState } from '~/screens/auth/store';
import spacing from '~/theme/spacing';
import { useRootNavigation } from '~/hooks/navigation';
import { Button, CheckBox } from '~/baseComponents';
import LogoImage from '../components/LogoImage';
import InputFullName from './components/InputFullName';
import { FieldNameType, SignUpProps } from '~/interfaces/IAuth';
import InputUserName from './components/InputUserName';
import FormCheckPassword from '../components/FormCheckPassword';
import InputEmail from './components/InputEmail';
import { openInAppBrowser } from '~/utils/link';
import { POLICY_URL } from '~/constants/url';
import authStacks from '~/router/navigator/AuthStack/stack';
import * as validation from '~/constants/commonRegex';
import useModalStore from '~/store/modal';
import SignUpSuccessModal from './components/SignUpSuccessModal';
import showToastError from '~/store/helper/showToastError';
import { authErrors } from '~/constants/authConstants';
import KeyboardSpacer from '~/beinComponents/KeyboardSpacer';
import { hideSplashScreen } from '~/router/helper';

const {
  EMAIL, FULL_NAME, USER_NAME, PASSWORD,
} = FieldNameType;

const SignUp: FC<SignUpProps> = ({ route, navigation }: SignUpProps) => {
  const { isValidLink, referralCode } = route?.params || {};

  const { rootNavigation } = useRootNavigation();
  const [disableSignUp, setDisableSignUp] = useState(true);
  const [isCheckbox, setIsCheckbox] = useState(false);

  const modalActions = useModalStore((state) => state.actions);

  const { signUp: signUpState, actions: authActions } = useAuthController((state: IAuthState) => state);
  const { loading, error: signUpError } = signUpState || {};

  const theme: ExtendedTheme = useTheme();
  const styles = themeStyles(theme);
  const { colors } = theme;

  const useFormData = useForm();
  const {
    formState: { errors },
    getValues,
    setError,
    reset,
  } = useFormData;

  useEffect(() => {
    const unsubscribe = navigation?.addListener('transitionEnd', async () => {
      await hideSplashScreen();
    });
    return unsubscribe;
  }, [navigation]);

  useFocusEffect(
    React.useCallback(
      () => () => {
        // Use for case: When click other deeplink to change other screen
        modalActions.hideModal();
      },
      [],
    ),
  );

  useEffect(() => {
    checkDisableSignUp();
    if (loading) Keyboard.dismiss();
  }, [isCheckbox, loading]);

  const onSubmit = () => {
    onSignUp();
  };

  const callbackSuccess = () => {
    const email = getValues(EMAIL);
    modalActions.showModal({
      isOpen: true,
      ContentComponent: <SignUpSuccessModal email={email} />,
    });
    authActions.setSignUpLoading(false);
    resetForm();
  };

  const callbackError = (error: any) => {
    authActions.setSignUpLoading(false);
    if (error?.code === authErrors.USER_EMAIL_EXISTED) {
      setError(EMAIL, {
        type: 'validate',
        message: t('auth:text_err_email_exist'),
      });
    } else if (error?.code === authErrors.USER_USER_NAME_EXISTED) {
      setError(USER_NAME, {
        type: 'validate',
        message: t('auth:text_err_user_name_exist'),
      });
    } else if (error?.code === authErrors.USER_EXISTED) {
      setError(EMAIL, {
        type: 'validate',
        message: t('auth:text_err_email_exist'),
      });
      setError(USER_NAME, {
        type: 'validate',
        message: t('auth:text_err_user_name_exist'),
      });
    } else {
      showToastError(error);
    }
  };

  const onSignUp = async () => {
    if (disableSignUp) return; // Reject if pressing enter while having invalid inputs

    setDisableSignUp(true);
    Keyboard.dismiss();

    const email = getValues(EMAIL);
    const fullName = getValues(FULL_NAME);
    const userName = getValues(USER_NAME);
    const password = getValues(PASSWORD);
    authActions.signUp(
      {
        referralCode: referralCode || '',
        email,
        password,
        fullName,
        userName,
      },
      callbackError,
      callbackSuccess,
    );
  };

  const resetForm = () => {
    reset();
    setIsCheckbox(false);
  };

  const checkDisableSignUp = () => {
    const email = getValues(EMAIL);
    const fullName = getValues(FULL_NAME);
    const userName = getValues(USER_NAME);
    const password = getValues(PASSWORD);
    const passwordCheck
      = validation.limitCharacterRegex.test(password)
      && validation.uppercaseLetterRegex.test(password)
      && validation.lowercaseLetterRegex.test(password)
      && validation.digitsRegex.test(password)
      && validation.specialCharacterRegex.test(password);

    const result
      = !isEmpty(errors) || !email || !fullName || !userName || !password || !passwordCheck || !isCheckbox || loading;

    setDisableSignUp(result);
  };

  const onCheckbox = () => {
    setIsCheckbox(!isCheckbox);
  };

  const onPrivacy = () => {
    openInAppBrowser(POLICY_URL);
  };

  const onSignIn = () => {
    rootNavigation.navigate(authStacks.signIn);
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  const optionsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(loading ? 1 : 0, { duration: 500 }),
  }));

  const renderLogoImage = () => <LogoImage />;

  const renderTitle = () => (
    <Text.H3 color={colors.neutral80} style={styles.title} useI18n>
      auth:text_sign_up_welcome
    </Text.H3>
  );

  const renderErrorLink = () => (
    <Text.BodyS testID="sign_up.error_link" color={colors.red40} useI18n>
      auth:text_sign_up_error_link
    </Text.BodyS>
  );

  const renderInputEmail = () => (
    <InputEmail
      useFormData={useFormData}
      signUpError={signUpError}
      checkDisableSignUp={checkDisableSignUp}
      onSubmit={onSubmit}
      loading={loading}
    />
  );

  const renderInputFullName = () => (
    <InputFullName
      useFormData={useFormData}
      signUpError={signUpError}
      checkDisableSignUp={checkDisableSignUp}
      onSubmit={onSubmit}
      loading={loading}
    />
  );

  const renderInputUserName = () => (
    <InputUserName
      useFormData={useFormData}
      signUpError={signUpError}
      checkDisableSignUp={checkDisableSignUp}
      onSubmit={onSubmit}
      loading={loading}
    />
  );

  const renderInputPassword = () => (
    <FormCheckPassword
      label="auth:input_label_password"
      placeholder="auth:input_label_password_placeholder"
      fieldName={FieldNameType.PASSWORD}
      useFormData={useFormData}
      loading={loading}
      styleLabel={styles.formCheckPassword}
      isCheckLowercaseLetter
      checkDisableBtn={checkDisableSignUp}
    />
  );

  const renderPrivacy = () => (
    <View style={styles.privacyContainer}>
      <CheckBox testID="sign_up.checkbox" style={styles.checkBox} isChecked={isCheckbox} onPress={onCheckbox} />
      <Text style={styles.privacyText}>
        <Text.BodyS color={colors.neutral40} useI18n>
          auth:text_agree_to_our
        </Text.BodyS>
        <Text.BodySMedium onPress={onPrivacy} color={colors.blue50} useI18n>
          auth:text_privacy_terms
        </Text.BodySMedium>
      </Text>
    </View>
  );

  const renderButtonSignUp = () => (
    <Button.Primary
      testID="sign_up.btn_sign_up"
      style={styles.btnSignUp}
      size="large"
      type="solid"
      disabled={disableSignUp}
      onPress={onSignUp}
      useI18n
    >
      auth:btn_sign_up
    </Button.Primary>
  );

  const renderSignIn = () => (
    <View style={styles.signInContainer}>
      <Text.BodyS color={colors.neutral40} useI18n>
        auth:text_you_have_an_account
      </Text.BodyS>
      <Text.BodySMedium onPress={onSignIn} color={colors.blue50} useI18n>
        auth:text_sign_in_now
      </Text.BodySMedium>
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
    <ScreenWrapper testID="sign_up" style={styles.root} isFullView>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback
          testID="sign_up.button_hide_keyboard"
          onPress={hideKeyboard}
          accessible={false}
          style={styles.flex1}
        >
          <View style={styles.paddingView}>
            {renderLogoImage()}
            {renderTitle()}
            {!isValidLink && renderErrorLink()}
            {renderInputEmail()}
            {renderInputFullName()}
            {renderInputUserName()}
            {renderInputPassword()}
            {renderPrivacy()}
            {renderButtonSignUp()}
            {renderSignIn()}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      {renderLoading()}
      <KeyboardSpacer iosOnly />
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
      alignContent: 'center',
      width: '100%',
    },
    contentContainer: {
      paddingTop: insets.top,
    },
    flex1: { flex: 1 },
    paddingView: {
      flex: 1,
      paddingHorizontal: spacing.padding.big,
      paddingTop: spacing.padding.extraLarge,
    },
    title: {
      marginTop: spacing.margin.large,
    },
    btnSignUp: {
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
    formCheckPassword: {
      marginTop: spacing.margin.small,
    },
    privacyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.margin.big,
    },
    checkBox: {
      marginRight: spacing.margin.small + spacing.margin.xTiny,
    },
    privacyText: {
      flex: 1,
    },
    signInContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.big,
    },
  });
};

export default SignUp;
