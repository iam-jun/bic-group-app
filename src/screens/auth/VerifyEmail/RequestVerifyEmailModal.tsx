import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import EmailOpened from '../../../../assets/images/img_email_opened.svg';
import EmailWarning from '../../../../assets/images/img_email_warning.svg';
import spacing from '~/theme/spacing';
import Button from '~/baseComponents/Button';
import useVerifyEmailController, { IVerifyEmailState } from './store';
import useModalStore from '~/store/modal';

type RequestVerifyEmailModalProps = {
  email: string;
  isFromSignIn?: boolean;
};

const RequestVerifyEmailModal = ({ email, isFromSignIn = true }: RequestVerifyEmailModalProps) => {
  const theme = useTheme();
  const { colors } = theme;

  const actions = useVerifyEmailController((state: IVerifyEmailState) => state.actions);
  const sentVerifyEmail = useVerifyEmailController((state: IVerifyEmailState) => state.sentVerifyEmail);
  const modalActions = useModalStore((state) => state.actions);

  useEffect(() => () => { actions.setSentVerifyEmail(false); }, []);

  const closeModal = () => {
    modalActions.hideModal();
  };

  const onPress = () => {
    actions.resendVerifyEmail({ email, redirectPage: isFromSignIn ? 'login' : 'reset-password' });
  };

  const renderContent = (icon: any, title:string, body: string, ButtonComponent?: any) => (
    <View testID="request_verify_email_modal" style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon
          testID="request_verify_email_modal.button_close"
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
      testID="request_verify_email_modal.button"
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
        !sentVerifyEmail
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
    paddingBottom: spacing.padding.extraLarge * 2,
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
