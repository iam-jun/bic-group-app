import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import { useDispatch } from 'react-redux';

import Text from '~/baseComponents/Text';
import TextInput from '~/beinComponents/inputs/TextInput';
import Button from '~/beinComponents/Button';
import * as validation from '~/constants/commonRegex';
import { useBaseHook } from '~/hooks';
import { IObject } from '~/interfaces/common';
import actions from '~/storeRedux/auth/actions';
import useAuth from '~/hooks/auth';
import { IForgotPasswordError } from '~/interfaces/IAuth';

import spacing from '~/theme/spacing';

interface Props {
  useFormData: IObject<any>;
}

const ForgotInputId: React.FC<Props> = ({ useFormData }) => {
  const dispatch = useDispatch();
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const styles = themeStyles(theme);

  const { forgotPasswordError, forgotPasswordLoading } = useAuth();
  const { errRequest }: IForgotPasswordError = forgotPasswordError || {};
  const refTextInput = useRef<any>();

  const {
    control,
    getValues,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
    trigger,
  } = useFormData;

  const {
    field: { onChange, value },
  } = useController({
    control,
    name: 'email',
    rules: {},
    defaultValue: '',
  });

  useEffect(
    () => {
      refTextInput.current?.focus();
    }, [],
  );

  useEffect(
    () => {
      if (errRequest) {
        setError(
          'email', {
            type: 'manual',
            message: errRequest,
          },
        );
      } else {
        clearErrors('email');
      }
    }, [errRequest],
  );

  const checkDisableRequest = () => {
    const email = getValues('email');
    return (
      forgotPasswordLoading
      || !email
      || !isEmpty(errors?.email)
      || !validation.emailRegex.test(email)
    );
  };
  const disableRequest = checkDisableRequest();

  const onRequestForgotPassword = () => {
    const email = getValues('email');
    if (email && !disableRequest) {
      setValue(
        'code', '', { shouldValidate: false },
      );
      clearErrors('code');
      dispatch(actions.forgotPasswordRequest(email));
    }
  };

  const validateEmail = async () => {
    await trigger('email');
  };

  return (
    <View style={styles.container}>
      {/* <Image */}
      {/*  resizeMode="contain" */}
      {/*  style={styles.logo} */}
      {/*  source={images.logo_bein} */}
      {/* /> */}
      <Text.H6>{t('auth:text_forgot_password')}</Text.H6>
      <Text.BodyS style={styles.desc}>
        {t('auth:text_forgot_password_input_desc')}
      </Text.BodyS>
      <TextInput
        ref={refTextInput}
        testID="inputEmail"
        placeholder={t('auth:input_label_email')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus
        value={value}
        editable={!forgotPasswordLoading}
        error={errors?.email}
        onChangeText={(text) => {
          onChange(text);
          validateEmail();
        }}
        helperType={errors?.email?.message ? 'error' : undefined}
        helperContent={errors?.email?.message}
        style={{ marginTop: 0, marginBottom: spacing.margin.small }}
        onSubmitEditing={() => onRequestForgotPassword()}
      />
      <Button.Primary
        testID="btnSend"
        disabled={disableRequest}
        loading={forgotPasswordLoading}
        onPress={onRequestForgotPassword}
        style={styles.btnSendRecoverCode}
      >
        {t('auth:btn_send_recover_code')}
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
    logo: {
      alignSelf: 'center',
      width: 64,
      height: 64,
      marginVertical: spacing.margin.big,
    },
    desc: {
      marginTop: spacing.margin.extraLarge,
      marginBottom: spacing.margin.large,
      color: colors.neutral80,
    },
    btnSendRecoverCode: {
      marginTop: spacing.margin.large,
    },
  });
};

export default ForgotInputId;
