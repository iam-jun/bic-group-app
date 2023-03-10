import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

import Icon from '~/baseComponents/Icon';
import Text from '~/baseComponents/Text';
import SVGIcon from '~/baseComponents/Icon/SvgIcon';
import EmailOpened from '../../../../../assets/images/img_email_opened.svg';
import spacing from '~/theme/spacing';
import useModalStore from '~/store/modal';
import useAuthController, { IAuthState } from '../../store';
import { IVerifyEmail } from '~/interfaces/IAuth';
import { authErrors } from '~/constants/authConstants';

type Props = {
  email: string;
};

const INITIAL_TIME = 60;

const SignUpSuccessModal = ({ email }: Props) => {
  const theme = useTheme();
  const { colors } = theme;

  const [time, setTime] = React.useState(INITIAL_TIME);
  const [errorText, setErrorText] = React.useState('');

  const modalActions = useModalStore((state) => state.actions);
  const { actions: authActions } = useAuthController((state: IAuthState) => state);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (time < 0) {
        clearInterval(timerId);
      } else {
        setTime(time - 1);
      }
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [time]);

  const closeModal = () => {
    modalActions.hideModal();
  };

  const onResend = () => {
    if (time < 0 && !errorText) {
      const payload: IVerifyEmail = {
        email,
        redirectPage: 'login',
      };
      authActions.resendVerifyEmail(payload, callbackError, callbackSuccess);
    }
  };

  const callbackError = (error: any) => {
    if (error?.code === authErrors.LIMIT_EXCEEDED_EXCEPTION) {
      setErrorText('auth:verify_email_limit_exceeded');
    } else {
      const text = error?.meta?.errors?.[0]?.message || error?.meta?.message || 'common:text_error_message';
      setErrorText(text);
    }
  };

  const callbackSuccess = () => {
    setTime(INITIAL_TIME);
  };

  const colorTextResend = time < 0 && !errorText ? colors.blue50 : colors.blue20;

  return (
    <View testID="sign_up_success_modal" style={styles.container}>
      <View style={styles.headerContainer}>
        <Icon
          testID="sign_up_success_modal.button_close"
          size={18}
          tintColor={colors.neutral40}
          icon="Xmark"
          onPress={closeModal}
        />
      </View>
      <SVGIcon source={EmailOpened} width={135} height={120} tintColor="none" />
      <Text.H3 useI18n style={styles.textCenter}>
        auth:title_sign_up_success_modal
      </Text.H3>
      <Text.BodyS useI18n style={[styles.textCenter, styles.textContent]}>
        auth:content_sign_up_success_modal
      </Text.BodyS>
      <Text.BodyS useI18n color={colors.neutral30} style={[styles.textCenter, styles.textNote]}>
        auth:text_request_new_code
      </Text.BodyS>
      <View style={styles.textResend}>
        <Text.BodyS testID="sign_up_success_modal.button_resend" useI18n color={colorTextResend} onPress={onResend}>
          auth:btn_resend_code
        </Text.BodyS>
        {time >= 0 && <Text.BodyS color={colors.blue20}>{` (${time}s)`}</Text.BodyS>}
      </View>
      {errorText ? (
        <Text.BodyS useI18n color={colors.red40} style={[styles.textCenter, styles.textContent]}>
          {errorText}
        </Text.BodyS>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.padding.small,
  },
  headerContainer: {
    alignSelf: 'flex-end',
    paddingRight: spacing.padding.small,
    marginBottom: 77,
  },
  textCenter: {
    textAlign: 'center',
    marginHorizontal: spacing.margin.big,
  },
  textContent: {
    marginTop: spacing.margin.tiny,
  },
  textNote: {
    marginTop: spacing.margin.big,
  },
  textResend: {
    flexDirection: 'row',
  },
});

export default SignUpSuccessModal;
