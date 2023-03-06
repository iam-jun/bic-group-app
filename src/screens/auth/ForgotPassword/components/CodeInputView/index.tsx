import React from 'react';
import {
  ActivityIndicator, StyleSheet, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';

import Text from '~/baseComponents/Text';
import { Button } from '~/baseComponents';
import { useBaseHook } from '~/hooks';
import { IObject } from '~/interfaces/common';

import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';
import spacing from '~/theme/spacing';
import useForgotPasswordStore, { IForgotPasswordState } from '../../store';
import FormCheckPw from './components/FormCheckPw';
import CodeInput from './components/CodeInput';
import * as validation from '~/constants/commonRegex';
import RequestVerifyEmailModal from '~/screens/auth/VerifyEmail/RequestVerifyEmailModal';
import { authErrors } from '~/constants/authConstants';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';

interface Props {
  useFormData: IObject<any>;
}

const CodeInputView: React.FC<Props> = ({ useFormData }) => {
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const styles = themeStyles(theme);

  const actions = useForgotPasswordStore((state: IForgotPasswordState) => state.actions);
  const loadingConfirm = useForgotPasswordStore((state: IForgotPasswordState) => state.loadingConfirm);
  const loadingRequest = useForgotPasswordStore((state: IForgotPasswordState) => state.loadingRequest);
  const modalActions = useModalStore((state) => state.actions);

  const {
    getValues,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
    trigger,
  } = useFormData;

  const checkDisableConfirm = () => {
    const code = getValues('code');
    const email = getValues('email');
    const newPassword = getValues('newPassword');
    const confirmPassword = getValues('confirmPassword');
    const passwordCheck
      = validation.limitCharacterRegex.test(newPassword)
      && validation.uppercaseLetterRegex.test(newPassword)
      && validation.digitsRegex.test(newPassword)
      && validation.specialCharacterRegex.test(newPassword);
    const passwordMatched = newPassword === confirmPassword;

    return (
      !isEmpty(errors)
      || !email
      || !code
      || !newPassword
      || !confirmPassword
      || !passwordCheck
      || !passwordMatched
      || loadingConfirm
    );
  };
  const disableConfirm = checkDisableConfirm();

  const checkDisableRequest = () => {
    const email = getValues('email');
    return loadingConfirm || !email || !isEmpty(errors.email);
  };
  const disableRequest = checkDisableRequest();

  const onConfirmForgotPassword = () => {
    const email = getValues('email');
    const code = getValues('code');
    const newPassword = getValues('newPassword');
    const confirmPassword = getValues('confirmPassword');
    if (
      email
      && code
      && newPassword
      && confirmPassword
      && newPassword === confirmPassword
      && !disableConfirm
    ) {
      actions.confirmForgotPassword({ email, code, password: newPassword });
    }
  };

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
      clearErrors('code');
      actions.setErrorConfirm();
      actions.requestResetPassword(email, handleError);
    }
  };

  const validateConfirmPassword = async () => {
    await trigger('confirmPassword');

    const newPassword = getValues('newPassword');
    const confirmPassword = getValues('confirmPassword');

    if (confirmPassword && (newPassword !== confirmPassword)) {
      setError(
        'confirmPassword', {
          type: 'manual',
          message: t('auth:text_err_confirm_password_not_matched'),
        },
      );
    }
  };

  const _email = getValues('email');

  return (
    <View testID="forgot_password.confirm_view" style={styles.container}>
      <View style={styles.inputSectionContainer}>
        <Text.H3>{t('auth:text_forgot_password_input_code_title')}</Text.H3>
        <Text.BodyM style={styles.desc}>
          {t('auth:text_forgot_password_input_code_desc')?.replace?.(
            '(email)',
            _email,
          )}
        </Text.BodyM>
        <CodeInput useFormData={useFormData} />
        <Text.BodySMedium style={styles.textExpiring}>{t('auth:text_expiring_time_code')}</Text.BodySMedium>
        <Text.BodyS style={styles.textRequestNewCode}>
          {t('auth:text_request_new_code')}
          {' '}
          <Text.BodySMedium
            onPress={onRequestForgotPassword}
            suppressHighlighting
            style={styles.highlightText}
            testID="forgot_password.button_resend_code"
          >
            {t('auth:btn_resend_code')}
            {loadingRequest && (
              <Text.BodySMedium>
                {' '}
                <ActivityIndicator
                  testID="forgot_password.button_resend_code.loading"
                  color={theme.colors.neutral40}
                  style={styles.loading}
                  size={12}
                />
              </Text.BodySMedium>
            )}
          </Text.BodySMedium>
        </Text.BodyS>
      </View>
      <View style={styles.inputSectionContainer}>
        <Text.H3 useI18n style={styles.newPasswordTitle}>
          auth:text_forgot_password_input_pw_title
        </Text.H3>
        <Text.LabelM useI18n style={styles.labelNewPw}>
          auth:input_label_new_password
        </Text.LabelM>
        <FormCheckPw useFormData={useFormData} loadingConfirm={loadingConfirm} />

        <Text.LabelM useI18n style={styles.labelConfirmNewPw}>
          auth:input_label_confirm_new_password
        </Text.LabelM>
        <PasswordInputController
          useFormData={useFormData}
          name="confirmPassword"
          rules={{
            required: t('auth:text_err_password_blank'),
          }}
          loading={loadingConfirm}
          testID="forgot_password.input_confirm_password"
          placeholder={t('auth:input_placeholder_confirm_password')}
          validateValue={validateConfirmPassword}
          textContentType="oneTimeCode"
        />
      </View>
      <Button.Primary
        useI18n
        testID="forgot_password.button_change_password"
        disabled={disableConfirm}
        loading={loadingConfirm}
        onPress={onConfirmForgotPassword}
        size="large"
      >
        auth:btn_submit
      </Button.Primary>
      <View style={styles.emptySpace} />
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: spacing.padding.big,
    },
    inputSectionContainer: {
      marginBottom: spacing.margin.big,
    },
    desc: {
      marginBottom: spacing.margin.large,
      marginTop: spacing.margin.large,
    },
    newPasswordTitle: {
      marginBottom: spacing.margin.large,
    },
    highlightText: {
      color: colors.blue50,
    },
    loading: {
      marginLeft: spacing.margin.small,
    },
    labelNewPw: {
      marginBottom: 4,
    },
    labelConfirmNewPw: {
      marginTop: 12,
      marginBottom: 4,
    },
    textExpiring: {
      textAlign: 'center',
      marginTop: 8,
    },
    textRequestNewCode: {
      color: colors.neutral30,
      textAlign: 'center',
      marginTop: 8,
    },
    emptySpace: {
      paddingBottom: spacing.padding.big,
    },
  });
};

export default CodeInputView;
