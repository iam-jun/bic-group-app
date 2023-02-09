import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import EmailOpened from '../../../../assets/images/img_email_opened.svg';
import EmailWarning from '../../../../assets/images/img_email_warning.svg';
import spacing from '~/theme/spacing';
import modalActions from '~/storeRedux/modal/actions';
import Button from '~/baseComponents/Button';
import useVerifyEmailController, { IVerifyEmailState } from './store';

type RequestVerifyEmailModalProps = {
  email: string;
  isFromSignIn?: boolean;
};

const RequestVerifyEmailModal = ({ email, isFromSignIn = true }: RequestVerifyEmailModalProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { colors } = theme;

  const [isSentVerifyEmail, setSentVerifyEmail] = useState(false);
  const authActions = useVerifyEmailController((state: IVerifyEmailState) => state.actions);

  const closeModal = () => {
    dispatch(modalActions.hideModal());
  };

  const onPress = () => {
    setSentVerifyEmail(true);
    authActions.resendVerifyEmail({ email, redirectPage: isFromSignIn ? 'login' : 'reset-password' });
  };

  const renderContent = (icon: any, title:string, body: string, ButtonComponent?: any) => (
    <View testID="request_verify_email_modal" style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon
          size={18}
          tintColor={colors.neutral40}
          icon="Xmark"
          onPress={closeModal}
        />
      </View>
      <SVGIcon
        source={icon}
        width={135}
        height={120}
        tintColor="none"
      />
      <Text.H3 useI18n style={[styles.title, styles.textCenter]}>{title}</Text.H3>
      <Text.BodyM useI18n style={styles.textCenter}>{body}</Text.BodyM>
      {ButtonComponent}
    </View>
  );

  const renderButton = () => (
    <Button.Primary
      useI18n
      onPress={onPress}
      style={styles.button}
    >
      auth:request_verify_email:cta
    </Button.Primary>
  );

  return (
    <View>
      {
        !isSentVerifyEmail
          ? renderContent(EmailWarning,
            'auth:request_verify_email:title',
            'auth:request_verify_email:body',
            renderButton())
          : renderContent(EmailOpened,
            'auth:send_verify_email_success:title',
            'auth:send_verify_email_success:body')
          }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.padding.small,
    minHeight: 300,
  },
  title: {
    marginVertical: spacing.margin.extraLarge,
  },
  button: {
    marginTop: spacing.margin.extraLarge,
  },
  headerContainer: {
    flex: 1,
    alignSelf: 'flex-end',
    padding: spacing.padding.small,
  },
  textCenter: {
    textAlign: 'center',
  },
});

export default RequestVerifyEmailModal;
