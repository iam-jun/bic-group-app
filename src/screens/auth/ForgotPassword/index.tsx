import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import Text from '~/beinComponents/Text';
import { forgotPasswordStages } from '~/constants/authConstants';

import { useBaseHook } from '~/hooks';
import useAuth from '~/hooks/auth';
import { useRootNavigation } from '~/hooks/navigation';
import { IForgotPasswordError } from '~/interfaces/IAuth';
import { rootNavigationRef } from '~/router/refs';
import ForgotInputCodePw from '~/screens/auth/ForgotPassword/components/ForgotInputCodePw';
import ForgotInputId from '~/screens/auth/ForgotPassword/components/ForgotInputId';
import actions from '~/storeRedux/auth/actions';
import { deviceDimensions } from '~/theme/dimension';

import spacing from '~/theme/spacing';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const { rootNavigation } = useRootNavigation();

  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const styles = themeStyles(
    theme, isPhone,
  );

  const { forgotPasswordStage, forgotPasswordError } = useAuth();
  const { errBox }: IForgotPasswordError = forgotPasswordError || {};

  const useFormData = useForm();

  useEffect(
    () => {
      dispatch(actions.setForgotPasswordStage(forgotPasswordStages.INPUT_ID));
    }, [],
  );

  const imgMaxWidth = 500;
  const imgPadding = 67;
  let imgSize = dimensions.width - 2 * imgPadding;
  if (imgSize > imgMaxWidth) imgSize = imgMaxWidth;

  const goBack = () => {
    if (forgotPasswordStage === forgotPasswordStages.INPUT_CODE_PW) {
      dispatch(actions.setForgotPasswordStage(forgotPasswordStages.INPUT_ID));
    } else {
      rootNavigation.goBack();
    }
  };

  const renderBtnBack = () => (
    <Icon
      icon="iconBack"
      size={16}
      onPress={goBack}
      testID="forgot_button.back"
      tintColor={theme.colors.neutral60}
    />
  );

  const renderComplete = () => (
    <View style={styles.completeContainer}>
      <View style={styles.textContainer}>
        <Text.H6>{t('auth:text_forgot_password_complete_title')}</Text.H6>
        <Text.BodyS style={styles.completeDescription}>
          {t('auth:text_forgot_password_complete_desc')}
        </Text.BodyS>
      </View>
      <Button.Primary
        testID="btnComplete"
        onPress={() => rootNavigationRef?.current?.goBack()}
      >
        {t('auth:btn_sign_in_now')}
      </Button.Primary>
    </View>
  );

  return (
    <ScreenWrapper testID="ForgotPasswordScreen" isFullView style={styles.root}>
      <KeyboardAvoidingView
        testID="edit_location.keyboard_avoiding_view"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {forgotPasswordStage !== forgotPasswordStages.COMPLETE && (
            <View style={styles.headerContainer}>{renderBtnBack()}</View>
          )}
          <View style={styles.contentContainer}>
            {forgotPasswordStage === forgotPasswordStages.INPUT_ID && (
              <ForgotInputId useFormData={useFormData} />
            )}
            {!errBox
              && forgotPasswordStage === forgotPasswordStages.INPUT_CODE_PW && (
              <ForgotInputCodePw useFormData={useFormData} />
            )}
            {forgotPasswordStage === forgotPasswordStages.COMPLETE
              && renderComplete()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const themeStyles = (
  theme: ExtendedTheme, isPhone: boolean,
) => {
  const insets = useSafeAreaInsets();
  const { colors } = theme;
  return StyleSheet.create({
    root: {
      flex: 1,
      alignContent: 'center',
      alignItems: !isPhone ? 'center' : undefined,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingHorizontal: spacing.padding.big,
      backgroundColor: colors.white,
    },
    container: {
      flex: 1,
      paddingBottom: spacing.padding.big,
      alignContent: 'center',
      width: '100%',
      maxWidth: 375,
    },
    headerContainer: {
      alignSelf: 'flex-start',
      marginTop: spacing.margin.small,
      padding: spacing.padding.small,
      backgroundColor: colors.violet1,
      borderRadius: spacing.borderRadius.small,
    },
    contentContainer: {
      flex: 1,
      justifyContent: !isPhone ? 'center' : undefined,
    },
    completeContainer: {
      paddingTop: spacing.padding.big + spacing.padding.large,
    },
    completeDescription: {
      marginTop: spacing.margin.extraLarge,
    },
    textContainer: {
      marginTop: spacing.margin.large,
      paddingTop: spacing.padding.large,
      marginBottom: spacing.margin.big,
    },
  });
};

export default ForgotPassword;
