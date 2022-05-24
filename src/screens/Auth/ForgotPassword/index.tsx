import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {
  StyleSheet,
  useWindowDimensions,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Button from '~/beinComponents/Button';
import Icon from '~/beinComponents/Icon';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';

import Text from '~/beinComponents/Text';
import {forgotPasswordStages} from '~/constants/authConstants';

import {useBaseHook} from '~/hooks';
import useAuth from '~/hooks/auth';
import {useRootNavigation} from '~/hooks/navigation';
import {IForgotPasswordError} from '~/interfaces/IAuth';
import icons from '~/resources/icons';
import {rootNavigationRef} from '~/router/navigator/refs';
import ForgotInputCodePw from '~/screens/Auth/ForgotPassword/components/ForgotInputCodePw';
import ForgotInputId from '~/screens/Auth/ForgotPassword/components/ForgotInputId';
import actions from '~/screens/Auth/redux/actions';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const {rootNavigation} = useRootNavigation();

  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const styles = themeStyles(theme, isPhone);

  const {forgotPasswordStage, forgotPasswordError} = useAuth();
  const {errBox}: IForgotPasswordError = forgotPasswordError || {};

  const useFormData = useForm();

  useEffect(() => {
    dispatch(actions.setForgotPasswordStage(forgotPasswordStages.INPUT_ID));
  }, []);

  const imgMaxWidth = 500;
  const imgPadding = 67;
  let imgSize = dimensions.width - 2 * imgPadding;
  if (imgSize > imgMaxWidth) imgSize = imgMaxWidth;

  const renderBtnBack = () => {
    return (
      <Icon
        // @ts-ignore
        icon={icons.iconBack}
        size={28}
        onPress={() => rootNavigation.goBack()}
        testID="forgot_button.back"
      />
    );
  };

  const renderComplete = () => {
    return (
      <View style={styles.completeContainer}>
        <View style={styles.textContainer}>
          <Text.BodySM>
            {t('auth:text_forgot_password_complete_title')}
          </Text.BodySM>
          <Text.Body style={styles.completeDescription}>
            {t('auth:text_forgot_password_complete_desc')}
          </Text.Body>
        </View>
        <Button.Primary
          testID="btnComplete"
          onPress={() => rootNavigationRef?.current?.goBack()}>
          {t('auth:btn_sign_in_now')}
        </Button.Primary>
      </View>
    );
  };

  return (
    <ScreenWrapper testID="ForgotPasswordScreen" isFullView style={styles.root}>
      <KeyboardAvoidingView
        testID="edit_location.keyboard_avoiding_view"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled={true}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          {forgotPasswordStage !== forgotPasswordStages.COMPLETE && (
            <View style={styles.headerContainer}>{renderBtnBack()}</View>
          )}
          <View style={styles.contentContainer}>
            {forgotPasswordStage === forgotPasswordStages.INPUT_ID && (
              <ForgotInputId useFormData={useFormData} />
            )}
            {!errBox &&
              forgotPasswordStage === forgotPasswordStages.INPUT_CODE_PW && (
                <ForgotInputCodePw useFormData={useFormData} />
              )}
            {forgotPasswordStage === forgotPasswordStages.COMPLETE &&
              renderComplete()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme, isPhone: boolean) => {
  const insets = useSafeAreaInsets();
  const {spacing, colors} = theme;
  return StyleSheet.create({
    root: {
      flex: 1,
      alignContent: 'center',
      alignItems: !isPhone ? 'center' : undefined,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingHorizontal: spacing.padding.big,
      backgroundColor: colors.background,
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
      paddingVertical: spacing.padding.small,
    },
    contentContainer: {
      flex: 1,
      justifyContent: !isPhone ? 'center' : undefined,
    },
    completeContainer: {
      // @ts-ignore
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
