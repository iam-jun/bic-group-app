import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import {useDispatch} from 'react-redux';
import {useBaseHook} from '~/hooks';
import ScreenWrapper from '~/components/ScreenWrapper';
import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme';
import Input from '~/components/inputs';
import * as actions from '~/screens/Auth/redux/actions';
import {Container, ViewSpacing} from '~/components';
import InputPassword from '~/components/inputs/InputPassword';
import * as refNavigator from '~/utils/refNavigator';
import {authStack} from '~/configs/navigator';
import * as validation from '~/constants/commonRegex';
import * as actionsCommon from '~/store/modal/actions';
import {ISignUpResponse} from '~/interfaces/IAuth';
import PrimaryButton from '~/components/buttons/PrimaryButton';
import TransparentButton from '~/components/buttons/TransparentButton';
import useAuth from '~/hooks/auth';

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
  const {loading} = useAuth();

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
      }),
    );
  };

  const onUsernameChange = (
    value: string,
    onChange: (param: string) => void,
  ) => {
    onChange(value);
    validateUsername(value);
  };

  const validateUsername = debounce(value => {
    if (value.trim().length === 0) {
      setError('username', {
        type: 'required',
        message: t('auth:text_err_username_blank'),
      });
    } else {
      clearErrors('username');
    }
  }, 50);

  const validateEmail = debounce(async () => {
    await trigger('email');
  }, 50);

  const validatePassword = debounce(async () => {
    await trigger('password');
  }, 50);

  const checkDisableBtn = () => {
    const email: string = getValues('email');
    const username: string = getValues('username');
    const password: string = getValues('password');
    if (!isEmpty(errors) || !email || !username || !password) return true;
    return false;
  };
  const disableBtn = checkDisableBtn();

  return (
    <ScreenWrapper testID="SignUpScreen" style={styles.container} isFullView>
      <Container>
        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <Input
              testID="inputUsername"
              label={t('auth:input_label_username')}
              placeholder={t('auth:input_label_username')}
              autoCapitalize="none"
              value={value}
              editable={!loading}
              error={errors.username}
              onChangeText={text => onUsernameChange(text, onChange)}
              helperType="error"
              helperContent={errors?.username?.message}
              helperVisible={errors.username}
            />
          )}
          rules={{required: t('auth:text_err_username_blank')}}
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
              keyboardType="email-address"
              value={value}
              editable={!loading}
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
        />

        <Controller
          control={control}
          render={({field: {onChange, value}}) => (
            <InputPassword
              testID="inputPassword"
              label={t('auth:input_label_password')}
              placeholder={t('auth:input_label_password')}
              error={errors.password}
              editable={!loading}
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
            min: 8,
            max: 20,
            // pattern: {
            //   value: validation.passwordRegex,
            //   message: t('auth:text_err_password_format'),
            // },
          }}
        />
        <ViewSpacing height={spacing.margin.base} />
        <TransparentButton
          testID="textSignin"
          title={t('auth:navigate_sign_in')}
          onPress={() => refNavigator.navigate(authStack.login)}
        />
        <ViewSpacing height={80} />
        <PrimaryButton
          testID="btnSignUp"
          disabled={disableBtn || loading}
          loading={loading}
          title={t('auth:btn_sign_up')}
          onPress={onSubmit}
        />
      </Container>
    </ScreenWrapper>
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
