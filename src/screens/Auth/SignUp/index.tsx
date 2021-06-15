import React from 'react';
import {Alert, Button, StyleSheet, Text} from 'react-native';
import {HelperText, useTheme} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';

import {useBaseHook} from '~/hooks';
import ThemeView from '~/theme/components/ThemeView';
import {IObject} from '~/interfaces/common';
import {useDispatch} from 'react-redux';
import {spacing} from '~/theme/configs';
import Input from '~/theme/components/Input';
import * as actions from '~/store/auth/actions';
import {ViewSpacing} from '~/theme/components';
import InputPassword from '~/theme/components/Input/InputPassword';
import * as refNavigator from '~/utils/refNavigator';
import {authStack} from '~/configs/navigator';
import {ISignUpResult} from 'amazon-cognito-identity-js';
import * as validation from '~/utils/validation';

const SignUp = (props: any) => {
  const dispatch = useDispatch();
  const {
    control,
    formState: {errors},
    trigger,
    setError,
    clearErrors,
    getValues,
  } = useForm();
  const theme: IObject<any> = useTheme();
  const {t} = useBaseHook();
  const styles = themeStyles(theme);

  const onSubmit = async () => {
    const email: string = getValues('email');
    const username: string = getValues('username');
    const password: string = getValues('password');
    await trigger();

    if (!isEmpty(errors)) return;
    dispatch(
      actions.signUp({
        username,
        password,
        email,
        callback,
      }),
    );
  };
  const callback = (result: ISignUpResult) => {
    if (result) {
      Alert.alert(
        t('auth:text_title_success'),
        t('auth:text_sign_up_success'),
        [
          {
            text: t('common:btn_comfirm'),
            onPress: () => props.navigation.goBack(),
          },
        ],
      );
    }
  };

  return (
    <ThemeView style={styles.container} isFullView>
      <Controller
        control={control}
        render={({field: {onChange, value}}) => (
          <Input
            testID="inputUsername"
            label={t('auth:input_label_username')}
            placeholder={t('auth:input_label_username')}
            autoCapitalize="none"
            value={value}
            error={errors.username}
            onChangeText={text => {
              onChange(text);
              setTimeout(async () => {
                if (text.trim().length === 0) {
                  setError('username', {
                    type: 'required',
                    message: t('auth:text_err_username_blank'),
                  });
                } else {
                  clearErrors('username');
                }
              }, 50);
            }}
            helperType="error"
            helperContent={errors?.username?.message}
            helperVisible={errors.username}
          />
        )}
        name="username"
        defaultValue=""
      />

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
              setTimeout(async () => {
                await trigger('email');
              }, 50);
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
              setTimeout(async () => {
                await trigger('password');
              }, 50);
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

      <Text onPress={() => refNavigator.navigate(authStack.login)}>
        {t('auth:navigate_sign_in')}
      </Text>
      <ViewSpacing height={80} />
      <Button
        testID="btnSignUp"
        title={t('auth:btn_sign_up')}
        onPress={onSubmit}
      />
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

export default SignUp;
