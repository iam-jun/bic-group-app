import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '~/beinComponents/Button';
import Icon from '~/baseComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';
import { forgotPasswordStages } from '~/constants/authConstants';
import { useRootNavigation } from '~/hooks/navigation';
import CodeInputView from '~/screens/auth/ForgotPassword/components/CodeInputView';
import EmailInputView from '~/screens/auth/ForgotPassword/components/EmailInputView';
import spacing from '~/theme/spacing';
import useForgotPasswordStore, { IForgotPasswordState } from './store';

const ForgotPassword = () => {
  const theme: ExtendedTheme = useTheme();
  const { rootNavigation } = useRootNavigation();

  const styles = themeStyles(theme);

  const useFormData = useForm();
  const actions = useForgotPasswordStore((state: IForgotPasswordState) => state.actions);
  const currentPasswordStage = useForgotPasswordStore((state: IForgotPasswordState) => state.screenCurrentStage);
  const reset = useForgotPasswordStore((state: IForgotPasswordState) => state.reset);

  useEffect(() => {
    reset();
  }, []);

  const goBack = () => {
    if (currentPasswordStage === forgotPasswordStages.INPUT_CODE_PW) {
      actions.setScreenCurrentStage(forgotPasswordStages.INPUT_ID);
    } else {
      rootNavigation.goBack();
    }
  };

  const renderBtnBack = () => (
    <Icon
      icon="iconBack"
      size={16}
      onPress={goBack}
      testID="forgot_password.button_back"
      tintColor={theme.colors.neutral60}
    />
  );

  const renderComplete = () => (
    <View testID="forgot_password.complete_view" style={styles.completeContainer}>
      <View style={styles.textContainer}>
        <Text.H6 useI18n>auth:text_forgot_password_complete_title</Text.H6>
        <Text.BodyS useI18n style={styles.completeDescription}>
          auth:text_forgot_password_complete_desc
        </Text.BodyS>
      </View>
      <Button.Primary
        testID="forgot_password.button_complete"
        onPress={goBack}
        useI18n
      >
        auth:btn_sign_in_now
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
          {currentPasswordStage !== forgotPasswordStages.COMPLETE && (
            <View style={styles.headerContainer}>{renderBtnBack()}</View>
          )}
          <View style={styles.contentContainer}>
            {currentPasswordStage === forgotPasswordStages.INPUT_ID && (
              <EmailInputView useFormData={useFormData} />
            )}
            { currentPasswordStage === forgotPasswordStages.INPUT_CODE_PW && (
            <CodeInputView useFormData={useFormData} />
            )}
            {currentPasswordStage === forgotPasswordStages.COMPLETE
              && renderComplete()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const insets = useSafeAreaInsets();
  const { colors } = theme;
  return StyleSheet.create({
    root: {
      flex: 1,
      alignContent: 'center',
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
