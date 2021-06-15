import React, {useState} from 'react';
import {Button, StyleSheet, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import {useDispatch} from 'react-redux';
import debounce from 'lodash/debounce';

import {useBaseHook} from '~/hooks';
import ThemeView from '~/theme/components/ThemeView';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme/configs';
import Input from '~/theme/components/Input';
import * as actions from '~/store/auth/actions';
import * as actionsCommon from '~/store/common/actions';
import {ViewSpacing} from '~/theme/components';
import InputPassword from '~/theme/components/Input/InputPassword';
import * as refNavigator from '~/utils/refNavigator';
import {authStack} from '~/configs/navigator';
import * as validation from '~/utils/validation';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState(1);
  const theme: IObject<any> = useTheme();
  const {t} = useBaseHook();
  const styles = themeStyles(theme);
  const {
    control,
    getValues,
    formState: {errors},
    trigger,
  } = useForm();

  const forgotPassword = async () => {
    const email = getValues('email');
    await trigger('email');
    if (errors.email) return;
    dispatch(actions.forgotPassword({email, callback}));
  };
  const callback = () => {
    dispatch(
      actionsCommon.showAlert({
        title: t('auth:text_title_success'),
        content: t('auth:text_check_email_description'),
        onConfirm: () => {
          setState(2);
        },
      }),
    );
  };

  const changePassword = async () => {
    const code = getValues('code');
    const email = getValues('email');
    const password = getValues('password');

    await trigger();
    if (!isEmpty(errors)) return;
    dispatch(
      actions.changePassword({
        code,
        email,
        password,
      }),
    );
  };

  const validateCode = debounce(async () => {
    await trigger('code');
  }, 50);

  const validateEmail = debounce(async () => {
    await trigger('email');
  }, 50);

  const validatePassword = debounce(async () => {
    await trigger('password');
  }, 50);

  const checkBtnSendEmail = () => {
    const email: string = getValues('email');
    if (!isEmpty(errors) || !email) return true;
    return false;
  };
  const sendEmailDisable = checkBtnSendEmail();

  const checkBtnChangePassword = () => {
    const code = getValues('code');
    const email = getValues('email');
    const password = getValues('password');
    if (!isEmpty(errors) || !email || !code || !password) return true;
    return false;
  };
  const changePasswordDisable = checkBtnChangePassword();

  return (
    <ThemeView
      testID="ForgotPasswordScreen"
      style={styles.container}
      isFullView>
      {state === 1 && (
        <>
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <Input
                testID="inputEmail"
                label={t('auth:input_label_email')}
                placeholder={t('auth:input_label_email')}
                autoCapitalize="none"
                value={value}
                error={errors.email}
                onChangeText={text => {
                  onChange(text);
                  validateEmail();
                }}
                helperType="error"
                helperContent={errors?.email?.message}
                helperVisible={errors.email}
              />
            )}
            rules={{
              required: t('auth:text_err_email_blank'),
              pattern: {
                value: validation.emailRegex,
                message: t('auth:text_err_email_format'),
              },
            }}
            name="email"
            defaultValue=""
          />

          <ViewSpacing height={80} />
          <Button
            testID="btnSend"
            disabled={sendEmailDisable}
            title={t('auth:btn_send')}
            onPress={forgotPassword}
          />
        </>
      )}
      {state === 2 && (
        <>
          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <Input
                testID="inputCode"
                label={t('auth:input_label_code')}
                placeholder={t('auth:input_label_code')}
                error={errors.code}
                value={value}
                onChangeText={text => {
                  onChange(text.trim());
                  validateCode();
                }}
                helperType="error"
                helperContent={errors?.code?.message}
                helperVisible={errors.code}
              />
            )}
            name="code"
            rules={{
              required: t('auth:text_err_code'),
              maxLength: {
                value: 6,
                message: t('auth:text_err_code'),
              },
            }}
            defaultValue=""
          />

          <Controller
            control={control}
            render={({field: {onChange, value}}) => (
              <InputPassword
                testID="inputPassword"
                label={t('auth:input_label_password')}
                placeholder={t('auth:input_label_password')}
                error={errors.password}
                value={value}
                onChangeText={text => {
                  onChange(text);
                  validatePassword();
                }}
                helperType="error"
                helperContent={errors?.password?.message}
                helperVisible={errors.password}
              />
            )}
            name="password"
            rules={{
              required: t('auth:text_err_password_blank'),
              pattern: {
                value: validation.passwordRegex,
                message: t('auth:text_err_password_format'),
              },
            }}
            defaultValue=""
          />

          <Button
            testID="btnChangePassword"
            disabled={changePasswordDisable}
            title={t('auth:btn_send')}
            onPress={changePassword}
          />
        </>
      )}

      <Text onPress={() => refNavigator.navigate(authStack.login)}>
        {t('auth:navigate_sign_in')}
      </Text>
    </ThemeView>
  );
};

const themeStyles = (theme: IObject<any>) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignContent: 'center',
    },
    button: {
      marginTop: spacing.margin.big,
    },
  });
};

export default ForgotPassword;
