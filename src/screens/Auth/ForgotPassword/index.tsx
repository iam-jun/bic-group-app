import React, {useEffect} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {useForm} from 'react-hook-form';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import FlashMessage from '~/beinComponents/FlashMessage';
import SVGIcon from '~/beinComponents/Icon/SvgIcon';
import Icon from '~/beinComponents/Icon';

import {useBaseHook} from '~/hooks';
import {authStack} from '~/configs/navigator';
import ForgotInputId from '~/screens/Auth/ForgotPassword/components/ForgotInputId';
import ForgotInputCodePw from '~/screens/Auth/ForgotPassword/components/ForgotInputCodePw';
import {forgotPasswordStages} from '~/constants/authConstants';
import useAuth from '~/hooks/auth';
import * as actions from '~/screens/Auth/redux/actions';
import {IForgotPasswordError} from '~/interfaces/IAuth';
import LockImg from '../../../../assets/images/Lock.svg';
import {ITheme} from '~/theme/interfaces';
import icons from '~/resources/icons';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {t, navigation} = useBaseHook();
  const styles = themeStyles(theme);
  const dimensions = useWindowDimensions();

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
        onPress={() => navigation.navigate(authStack.login)}
      />
    );
  };

  const renderComplete = () => {
    return (
      <View style={styles.completeContainer}>
        <SVGIcon
          style={{alignSelf: 'center'}}
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
          onPress={() => navigation.navigate(authStack.login)}>
          {t('auth:btn_sign_in')}
        </Button.Primary>
      </View>
    );
  };

  return (
    <ScreenWrapper testID="ForgotPasswordScreen" isFullView>
      <View style={styles.container}>
        {forgotPasswordStage !== forgotPasswordStages.COMPLETE && (
          <View style={styles.headerContainer}>{renderBtnBack()}</View>
        )}
        {!!errBox && (
          <FlashMessage
            type="error"
            onClose={onClearErrorBox}
            style={{marginTop: theme.spacing.margin.big}}>
            {errBox}
          </FlashMessage>
        )}
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
    </ScreenWrapper>
  );
};

const themeStyles = (theme: ITheme) => {
  const insets = useSafeAreaInsets();
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      alignContent: 'center',
      paddingTop: insets.top,
      // @ts-ignore
      paddingBottom: insets.bottom + spacing.padding.big,
      paddingHorizontal: spacing.padding.big,
      backgroundColor: colors.background,
    },
    headerContainer: {
      marginTop: spacing.margin.small,
      paddingVertical: spacing.padding.small,
    },
    completeContainer: {
      // @ts-ignore
      paddingTop: spacing.padding.big + spacing.padding.large,
    },
    textContainer: {
      marginTop: spacing.margin.large,
      paddingTop: spacing.padding.large,
      marginBottom: spacing.margin.big,
    },
  });
};

export default ForgotPassword;
