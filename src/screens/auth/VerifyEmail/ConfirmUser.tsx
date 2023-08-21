import React, { FC, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import ScreenWrapper from '~/beinComponents/ScreenWrapper';
import Text from '~/baseComponents/Text';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import Button from '~/baseComponents/Button';
import { spacing } from '~/theme';
import EmailVerified from '../../../../assets/images/img_email_verified.svg';
import { IRouteParams } from '~/interfaces/IRouter';
import useVerifyEmailController, { IVerifyEmailState } from './store';
import EmailExpired from '../../../../assets/images/img_email_expired.svg';
import useCommonController from '~/screens/store';
import { useRootNavigation } from '~/hooks/navigation';
import authStacks from '~/router/navigator/AuthStack/stack';
import LoadingImage from '../../../../assets/images/img_time.svg';
import Header from '~/beinComponents/Header';

const TIME_TO_REDIRECT_SCREEN = 5 * 1000;

const ConfirmUser : FC<IRouteParams> = (props) => {
  const params = props?.route?.params || {};
  const { confirmationCode, redirectTo, username } = params?.params || {};

  const { rootNavigation } = useRootNavigation();
  const [isRedirected, setRedirected] = useState<boolean>(false);

  const actions = useVerifyEmailController((state: IVerifyEmailState) => state.actions);
  const linkExpired = useVerifyEmailController((state: IVerifyEmailState) => state.linkIsExpired);
  const loading = useVerifyEmailController((state: IVerifyEmailState) => state.loadingConfirmSiginUp);
  const userProfileData = useCommonController((state) => state.myProfile);

  useEffect(() => {
    actions.confirmSignUp(username, confirmationCode);
  }, [confirmationCode, username]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!loading && !linkExpired && !isRedirected) {
        onPress();
      }
    }, TIME_TO_REDIRECT_SCREEN);
    return () => {
      clearTimeout(timerId);
    };
  }, [loading, linkExpired, isRedirected]);

  const onPress = () => {
    if (!!userProfileData?.id && rootNavigation?.canGoBack) {
      rootNavigation?.goBack?.();
      return;
    }
    if (redirectTo === 'login') {
      setRedirected(true);
      rootNavigation.replace(authStacks.signIn);
      return;
    }
    if (redirectTo === 'reset-password') {
      rootNavigation.replace(authStacks.forgotPassword);
    }
  };

  const handleContent = () => {
    /* eslint no-else-return: ["error", {allowElseIf: true}] */
    if (!!loading) {
      return renderContent(LoadingImage, 'common:text_loading');
    } else if (!!linkExpired) {
      return renderContent(EmailExpired, 'auth:verify_email_expired');
    }
    return renderContent(EmailVerified, 'auth:verify_email_success', renderButton());
  };

  const renderContent = (icon: any, title:string, ButtonComponent?: any) => (
    <View testID="confirm_user" style={styles.container}>
      <SVGIcon
        source={icon}
        width={135}
        height={120}
        tintColor="none"
      />
      <Text.H3
        testID="confirm_user.text"
        useI18n
        style={[styles.title, styles.textCenter]}
      >
        {title}
      </Text.H3>
      {ButtonComponent}
    </View>
  );

  const renderButton = () => (
    <Button.Primary
      testID="confirm_user.button"
      useI18n
      onPress={onPress}
      style={styles.button}
    >
      auth:button_redirect_now
    </Button.Primary>
  );

  return (
    <ScreenWrapper testID="confirm_user" style={styles.flex1} isFullView>

      {!!linkExpired && !loading
       && (
       <Header icon="Xmark" hideBack onPressIcon={onPress} />
       )}
      {handleContent()}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.padding.large,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    marginVertical: spacing.margin.large,
  },
  button: {
    marginTop: spacing.margin.extraLarge,
  },
  textCenter: {
    textAlign: 'center',
  },
  loading: {
    marginTop: spacing.margin.extraLarge,
  },
  closeButton: {
    marginTop: spacing.margin.extraLarge,
    alignSelf: 'flex-end',
    marginRight: spacing.margin.large,
    padding: spacing.padding.base,
  },
});

export default ConfirmUser;
