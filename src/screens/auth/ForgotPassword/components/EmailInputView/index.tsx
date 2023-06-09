import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';

import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import * as validation from '~/constants/commonRegex';
import { useBaseHook } from '~/hooks';
import { IObject } from '~/interfaces/common';
import spacing from '~/theme/spacing';
import useForgotPasswordStore, { IForgotPasswordState } from '../../store';
import RequestVerifyEmailModal from '~/screens/auth/VerifyEmail/RequestVerifyEmailModal';
import { authErrorMessage, authErrors } from '~/constants/authConstants';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';
import { FieldNameType } from '~/interfaces/IAuth';
import FormInput from '~/screens/auth/components/FormInput';
import useAuthController, { IAuthState } from '~/screens/auth/store';

interface Props {
  useFormData: IObject<any>;
}

const {
  EMAIL, CODE, NEW_PASSWORD, CONFIRM_PASSWORD,
} = FieldNameType;

const EmailInputView: React.FC<Props> = ({ useFormData }) => {
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const styles = themeStyles(theme);

  const actions = useForgotPasswordStore((state: IForgotPasswordState) => state.actions);
  const errorRequest = useForgotPasswordStore((state: IForgotPasswordState) => state.errorRequest);
  const loadingRequest = useForgotPasswordStore((state: IForgotPasswordState) => state.loadingRequest);
  const modalActions = useModalStore((state) => state.actions);
  const authActions = useAuthController((state: IAuthState) => state.actions);

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
      if (errorRequest) {
        setError(
          EMAIL, {
            type: 'manual',
            message: errorRequest,
          },
        );
      } else {
        clearErrors(EMAIL);
      }
    }, [errorRequest],
  );

  const checkDisableRequest = () => {
    const email = getValues(EMAIL);
    return (
      loadingRequest
      || !email
      || !isEmpty(errors?.email)
      || !validation.emailRegex.test(email)
    );
  };
  const disableRequest = checkDisableRequest();

  const handleCheckUser = (result: boolean, email: string) => {
    if (result) {
      modalActions.showModal({
        isOpen: true,
        titleFullScreen: 'groups:group_content:btn_your_groups',
        ContentComponent: <RequestVerifyEmailModal email={email} isFromSignIn={false} />,
      });
    } else {
      setError(EMAIL, {
        type: 'validate',
        message: t('auth:text_err_user_not_exist'),
      });
    }
  };

  const handleError = (error: any) => {
    if (error?.code === authErrors.USER_NOT_FOUND_EXCEPTION) {
      const email = getValues(EMAIL);
      authActions.checkIsUserNotVerified(email, (result: boolean) => { handleCheckUser(result, email); });
    } else if (
      error?.code === authErrors.NOT_AUTHORIZED_EXCEPTION
      && error?.message === authErrorMessage.USER_IS_DISABLED
    ) {
      setError(EMAIL, {
        type: 'validate',
        message: t('auth:text_err_user_deactivated'),
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
    const email = getValues(EMAIL);
    if (email && !disableRequest) {
      setValue(
        CODE, '', { shouldValidate: false },
      );
      setValue(
        NEW_PASSWORD, '', { shouldValidate: false },
      );
      setValue(
        CONFIRM_PASSWORD, '', { shouldValidate: false },
      );
      clearErrors([CODE, NEW_PASSWORD, CONFIRM_PASSWORD]);

      actions.requestResetPassword(email, handleError);
    }
  };

  const validateEmail = async () => {
    await trigger(EMAIL);
  };

  return (
    <View testID="forgot_password.require_email" style={styles.container}>
      <Text.H3 useI18n>auth:text_forgot_password</Text.H3>
      <Text.BodyS useI18n style={styles.desc}>
        auth:text_forgot_password_input_desc
      </Text.BodyS>
      <FormInput
        useFormData={useFormData}
        fieldName={EMAIL}
        testID="forgot_password.input_email"
        placeholder={t('auth:input_label_email')}
        isAutoFocus
        keyboardType="email-address"
        autoCapitalize="none"
        isEditable={!loadingRequest}
        onSubmit={onRequestForgotPassword}
        validateValue={validateEmail}
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
  });
};

export default EmailInputView;
