import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import actions from '~/screens/Auth/redux/actions';
import * as validation from '~/constants/commonRegex';
import {useBaseHook} from '~/hooks';
import useAuth from '~/hooks/auth';
import {IObject} from '~/interfaces/common';
import {IForgotPasswordError} from '~/interfaces/IAuth';
import {ITheme} from '~/theme/interfaces';
import TextInputController from '~/beinComponents/inputs/TextInputController';
import PasswordInputController from '~/beinComponents/inputs/PasswordInputController';

interface Props {
  useFormData: IObject<any>;
}

const ForgotInputCodePw: React.FC<Props> = ({useFormData}) => {
  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {t} = useBaseHook();
  const styles = themeStyles(theme);

  const {forgotPasswordError, forgotPasswordLoading} = useAuth();
  const {errConfirm}: IForgotPasswordError = forgotPasswordError || {};

  useEffect(() => {
    if (errConfirm) {
      setError('code', {
        type: 'manual',
        message: errConfirm,
      });
    } else {
      clearErrors('code');
    }
  }, [errConfirm]);

  const {
    getValues,
    setError,
    clearErrors,
    setValue,
    formState: {errors},
    trigger,
  } = useFormData;

  const checkDisableConfirm = () => {
    const code = getValues('code');
    const email = getValues('email');
    const newPassword = getValues('newPassword');
    const confirmPassword = getValues('confirmPassword');
    const passwordMatched = newPassword === confirmPassword;
    return (
      !isEmpty(errors) ||
      !email ||
      !code ||
      !newPassword ||
      !confirmPassword ||
      !passwordMatched ||
      forgotPasswordLoading
    );
  };
  const disableConfirm = checkDisableConfirm();

  const checkDisableRequest = () => {
    const email = getValues('email');
    return forgotPasswordLoading || !email || !isEmpty(errors.email);
  };
  const disableRequest = checkDisableRequest();

  const checkDisableInputPassword = () => {
    const code = getValues('code');
    return !code || errors.code;
  };
  const disableInputPassword = checkDisableInputPassword();

  const onConfirmForgotPassword = () => {
    const email = getValues('email');
    const code = getValues('code');
    const newPassword = getValues('newPassword');
    const confirmPassword = getValues('confirmPassword');
    if (
      email &&
      code &&
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword &&
      !disableConfirm
    ) {
      dispatch(
        actions.forgotPasswordConfirm({email, code, password: newPassword}),
      );
    }
  };

  const onRequestForgotPassword = async () => {
    const email = getValues('email');
    if (email && !disableRequest) {
      setValue('code', '', {shouldValidate: false});
      clearErrors('code');
      dispatch(actions.forgotPasswordRequest(email));
    }
  };

  const validateCode = async () => {
    await trigger('code');
  };

  const validateNewPassword = async () => {
    await trigger('newPassword');
  };

  const validateConfirmPassword = async () => {
    await trigger('confirmPassword');
    if (getValues('newPassword') !== getValues('confirmPassword')) {
      setError('confirmPassword', {
        type: 'manual',
        message: t('auth:text_err_confirm_password_not_matched'),
      });
    }
  };

  const _email = getValues('email');

  return (
    <View style={styles.container}>
      <View style={styles.inputSectionContainer}>
        <Text.BodyM>
          {t('auth:text_forgot_password_input_code_title')}
        </Text.BodyM>
        <Text.BodyS style={styles.desc}>
          {t('auth:text_forgot_password_input_code_desc')?.replace?.(
            '(email)',
            _email,
          )}
        </Text.BodyS>
        <TextInputController
          testID="inputCode"
          useFormData={useFormData}
          name="code"
          rules={{
            required: t('auth:text_err_code'),
            pattern: {
              value: validation.codeRegex,
              message: t('auth:text_err_code'),
            },
          }}
          validateValue={validateCode}
          placeholder={t('auth:input_label_code')}
          keyboardType={'numeric'}
        />
        <Text.BodyS>
          {t('auth:text_request_new_code')}{' '}
          <Text.BodySM
            onPress={onRequestForgotPassword}
            suppressHighlighting
            style={styles.highlightText}>
            {t('auth:btn_resend_code')}
          </Text.BodySM>
        </Text.BodyS>
      </View>
      <View style={styles.inputSectionContainer}>
        <Text.BodyM style={styles.newPasswordTitle}>
          {t('auth:text_forgot_password_input_pw_title')}
        </Text.BodyM>
        <PasswordInputController
          useFormData={useFormData}
          name={'newPassword'}
          rules={{
            required: t('auth:text_err_password_blank'),
            maxLength: {
              value: 20,
              message: t('auth:text_err_password_characters'),
            },
            minLength: {
              value: 8,
              message: t('auth:text_err_password_characters'),
            },
            validate: () => {
              const value = getValues('newPassword');
              if (!/(?=.*?[A-Z])/.test(value)) {
                return t('auth:text_err_password_required_upper_case');
              }
              if (!/(?=.*?[a-z])/.test(value)) {
                return t('auth:text_err_password_required_lower_case');
              }
              if (!/(?=.*?[0-9])/.test(value)) {
                return t('auth:text_err_password_required_number');
              }
              if (!/(?=.*?[^\w\s])/.test(value)) {
                return t('auth:text_err_password_required_symbols');
              }
            },
          }}
          loading={forgotPasswordLoading}
          disableInput={disableInputPassword}
          testID={'inputNewPassword'}
          placeholder={t('auth:input_label_new_password')}
          validateValue={validateNewPassword}
        />

        <PasswordInputController
          useFormData={useFormData}
          name={'confirmPassword'}
          rules={{
            required: t('auth:text_err_password_blank'),
          }}
          loading={forgotPasswordLoading}
          disableInput={disableInputPassword}
          testID={'inputConfirmPassword'}
          placeholder={t('auth:input_label_confirm_new_password')}
          validateValue={validateConfirmPassword}
        />
      </View>
      <Button.Primary
        testID="btnChangePassword"
        disabled={disableConfirm}
        loading={forgotPasswordLoading}
        onPress={onConfirmForgotPassword}
        style={styles.btnConfirmNewPassword}>
        {t('auth:input_label_confirm_new_password')}
      </Button.Primary>
    </View>
  );
};

const themeStyles = (theme: ITheme) => {
  const {spacing, colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: spacing.padding.big,
    },
    inputSectionContainer: {
      marginBottom: spacing.margin.big,
    },
    desc: {
      marginBottom: spacing.margin.base,
      marginTop: spacing.margin.tiny,
    },
    btnConfirmNewPassword: {
      marginTop: spacing.margin.extraLarge,
    },
    newPasswordTitle: {
      marginBottom: spacing.margin.small,
    },
    highlightText: {
      color: colors.textTertiary,
    },
  });
};

export default ForgotInputCodePw;
