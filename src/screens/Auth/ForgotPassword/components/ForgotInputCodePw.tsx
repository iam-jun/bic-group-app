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

  return (
    <View style={styles.container}>
      <View style={styles.inputSectionContainer}>
        <Text.H6>{t('auth:text_forgot_password_input_code_title')}</Text.H6>
        <Text.Body style={styles.desc}>
          {t('auth:text_forgot_password_input_code_desc')}
        </Text.Body>
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
          label={t('auth:input_label_code')}
          placeholder={t('auth:input_label_code')}
          helperAction={t('auth:text_request_new_code')}
          helperContentTriggerAction={t('auth:text_err_wrong_code')}
          helperActionOnPress={onRequestForgotPassword}
          keyboardType={'numeric'}
        />
      </View>
      <View style={styles.inputSectionContainer}>
        <Text.H6>{t('auth:text_forgot_password_input_pw_title')}</Text.H6>
        <Text.Body style={styles.desc}>
          {t('auth:text_forgot_password_input_pw_desc')}
        </Text.Body>
        <PasswordInputController
          useFormData={useFormData}
          name={'newPassword'}
          rules={{
            required: t('auth:text_err_password_blank'),
            // min: 8,
            // max: 20,
            pattern: {
              value: validation.passwordRegex,
              message: t('auth:text_err_password_format'),
            },
          }}
          loading={forgotPasswordLoading}
          disableInput={disableInputPassword}
          testID={'inputNewPassword'}
          label={t('auth:input_label_new_password')}
          placeholder={t('auth:input_label_new_password')}
          validateValue={validateNewPassword}
        />

        <PasswordInputController
          useFormData={useFormData}
          name={'confirmPassword'}
          rules={{
            required: t('auth:text_err_password_blank'),
            // min: 8,
            // max: 20,
            // pattern: {
            //   value: validation.passwordRegex,
            //   message: t('auth:text_err_password_format'),
            // },
          }}
          loading={forgotPasswordLoading}
          disableInput={disableInputPassword}
          testID={'inputConfirmPassword'}
          label={t('auth:input_label_confirm_new_password')}
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
  const {spacing} = theme;
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
    },
    btnConfirmNewPassword: {
      marginTop: spacing.margin.extraLarge,
    },
  });
};

export default ForgotInputCodePw;
