import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';

import Text from '~/baseComponents/Text';
import TextInputController from '~/beinComponents/inputs/TextInputController';
import { Button } from '~/baseComponents';
import * as validation from '~/constants/commonRegex';
import { useBaseHook } from '~/hooks';
import { IObject } from '~/interfaces/common';
import spacing from '~/theme/spacing';
import useForgotPasswordStore, { IForgotPasswordState } from '../../store';
import RequestVerifyEmailModal from '~/screens/auth/VerifyEmail/RequestVerifyEmailModal';
import { authErrors } from '~/constants/authConstants';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';

interface Props {
  useFormData: IObject<any>;
}

const EmailInputView: React.FC<Props> = ({ useFormData }) => {
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const styles = themeStyles(theme);
  const { colors } = theme;

  const actions = useForgotPasswordStore((state: IForgotPasswordState) => state.actions);
  const errorRequest = useForgotPasswordStore((state: IForgotPasswordState) => state.errorRequest);
  const loadingRequest = useForgotPasswordStore((state: IForgotPasswordState) => state.loadingRequest);
  const modalActions = useModalStore((state) => state.actions);

  const refTextInput = useRef<any>();

  const {
    getValues,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
    trigger,
  } = useFormData;

  useEffect(
    () => {
      refTextInput.current?.focus();
    }, [],
  );

  useEffect(
    () => {
      if (errorRequest) {
        setError(
          'email', {
            type: 'manual',
            message: errorRequest,
          },
        );
      } else {
        clearErrors('email');
      }
    }, [errorRequest],
  );

  const checkDisableRequest = () => {
    const email = getValues('email');
    return (
      loadingRequest
      || !email
      || !isEmpty(errors?.email)
      || !validation.emailRegex.test(email)
    );
  };
  const disableRequest = checkDisableRequest();

  const handleError = (error: any) => {
    if (error?.code === authErrors.USER_NOT_FOUND_EXCEPTION) {
      const email = getValues('email');
      modalActions.showModal({
        isOpen: true,
        titleFullScreen: 'groups:group_content:btn_your_groups',
        ContentComponent: <RequestVerifyEmailModal email={email} isFromSignIn={false} />,
      });
    } else {
      if (error?.code === authErrors.LIMIT_EXCEEDED_EXCEPTION) {
        showToastError({ meta: { message: t('auth:text_err_limit_exceeded') } });
      } else {
        showToastError(error);
      }
      actions.setErrorRequest('');
    }
  };

  const onRequestForgotPassword = () => {
    const email = getValues('email');
    if (email && !disableRequest) {
      setValue(
        'code', '', { shouldValidate: false },
      );
      setValue(
        'newPassword', '', { shouldValidate: false },
      );
      setValue(
        'confirmPassword', '', { shouldValidate: false },
      );
      clearErrors(['code', 'newPassword', 'confirmPassword']);

      actions.requestResetPassword(email, handleError);
    }
  };

  const validateEmail = async () => {
    await trigger('email');
  };

  return (
    <View testID="forgot_password.require_email" style={styles.container}>
      <Text.H3 useI18n>auth:text_forgot_password</Text.H3>
      <Text.BodyS useI18n style={styles.desc}>
        auth:text_forgot_password_input_desc
      </Text.BodyS>
      <TextInputController
        useFormData={useFormData}
        name="email"
        testID="forgot_password.input_email"
        placeholder={t('auth:input_label_email')}
        placeholderTextColor={colors.neutral20}
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus
        editable={!loadingRequest}
        style={styles.inputEmailContainer}
        onSubmitEditing={onRequestForgotPassword}
        validateValue={validateEmail}
        textColor={colors.neutral60}
        ref={refTextInput}
      />
      <Button.Primary
        useI18n
        testID="forgot_password.button_send"
        disabled={disableRequest}
        loading={loadingRequest}
        onPress={onRequestForgotPassword}
        style={styles.btnSendRecoverCode}
        size="large"
      >
        auth:btn_send_recover_code
      </Button.Primary>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingTop: spacing.padding.big,
    },
    desc: {
      marginTop: spacing.margin.large,
      marginBottom: spacing.margin.large,
      color: colors.neutral80,
    },
    btnSendRecoverCode: {
      marginTop: spacing.margin.big,
    },
    inputEmailContainer: {
      marginVertical: 0,
    },
  });
};

export default EmailInputView;
