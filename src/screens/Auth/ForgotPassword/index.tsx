import React, {useEffect} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {useForm} from 'react-hook-form';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
// import FlashMessage from '~/beinComponents/FlashMessage';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import Icon from '~/beinComponents/Icon';

import {useBaseHook} from '~/hooks';
import ForgotInputId from '~/screens/Auth/ForgotPassword/components/ForgotInputId';
import ForgotInputCodePw from '~/screens/Auth/ForgotPassword/components/ForgotInputCodePw';
import {forgotPasswordStages} from '~/constants/authConstants';
import useAuth from '~/hooks/auth';
import * as actions from '~/screens/Auth/redux/actions';
import {IForgotPasswordError} from '~/interfaces/IAuth';
import LockImg from '../../../../assets/images/auth_forgot_password_complete.svg';
import {ITheme} from '~/theme/interfaces';
import icons from '~/resources/icons';
import {deviceDimensions} from '~/theme/dimension';
import {rootNavigationRef} from '~/router/navigator/refs';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const styles = themeStyles(theme, isPhone);

  const {forgotPasswordStage, forgotPasswordError} = useAuth();
  const {errBox}: IForgotPasswordError = forgotPasswordError || {};

  const useFormData = useForm();

  useEffect(() => {
    dispatch(actions.setForgotPasswordStage(forgotPasswordStages.INPUT_ID));
  }, []);

  const onClearErrorBox = () => {
    dispatch(actions.setForgotPasswordError({errBox: ''}));
  };

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
        onPress={() => navigation.goBack()}
      />
    );
  };

  const renderComplete = () => {
    return (
      <View style={styles.completeContainer}>
        <SVGIcon
          style={styles.svg}
          // @ts-ignore
          source={LockImg}
          size={imgSize}
        />
        <View style={styles.textContainer}>
          <Text.H6>{t('auth:text_forgot_password_complete_title')}</Text.H6>
          <Text.Body>{t('auth:text_forgot_password_complete_desc')}</Text.Body>
        </View>
        <Button.Primary
          testID="btnComplete"
          onPress={() => rootNavigationRef?.current?.goBack()}>
          {t('auth:btn_sign_in')}
        </Button.Primary>
      </View>
    );
  };

  return (
    <ScreenWrapper testID="ForgotPasswordScreen" isFullView style={styles.root}>
      <View style={styles.container}>
        {forgotPasswordStage !== forgotPasswordStages.COMPLETE && (
          <View style={styles.headerContainer}>{renderBtnBack()}</View>
        )}
        {/* {!!errBox && (
          <FlashMessage
            type="error"
            onClose={onClearErrorBox}
            style={styles.flashMessage}>
            {errBox}
          </FlashMessage>
        )} */}
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
      </View>
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
    // flashMessage: {
    //   marginTop: theme.spacing.margin.big,
    // },
    completeContainer: {
      // @ts-ignore
      paddingTop: spacing.padding.big + spacing.padding.large,
    },
    svg: {
      alignSelf: 'center',
    },
    textContainer: {
      marginTop: spacing.margin.large,
      paddingTop: spacing.padding.large,
      marginBottom: spacing.margin.big,
    },
  });
};

export default ForgotPassword;
