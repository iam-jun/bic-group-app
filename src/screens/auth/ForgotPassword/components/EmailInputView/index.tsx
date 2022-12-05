import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';

import Text from '~/baseComponents/Text';
import TextInput from '~/beinComponents/inputs/TextInput';
import Button from '~/beinComponents/Button';
import * as validation from '~/constants/commonRegex';
import { useBaseHook } from '~/hooks';
import { IObject } from '~/interfaces/common';
import spacing from '~/theme/spacing';
import useForgotPasswordStore, { IForgotPasswordState } from '../../store';

interface Props {
  useFormData: IObject<any>;
}

const EmailInputView: React.FC<Props> = ({ useFormData }) => {
  const theme: ExtendedTheme = useTheme();
  const { t } = useBaseHook();
  const styles = themeStyles(theme);

  const actions = useForgotPasswordStore((state: IForgotPasswordState) => state.actions);
  const errorRequest = useForgotPasswordStore((state: IForgotPasswordState) => state.errorRequest);
  const loadingRequest = useForgotPasswordStore((state: IForgotPasswordState) => state.loadingRequest);

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

  const onRequestForgotPassword = () => {
    const email = getValues('email');
    if (email && !disableRequest) {
      setValue(
        'code', '', { shouldValidate: false },
      );
      clearErrors('code');
      actions.requestResetPassword(email);
    }
  };

  const validateEmail = async () => {
    await trigger('email');
  };

  return (
    <View testID="forgot_password.require_email" style={styles.container}>
      <Text.H6 useI18n>auth:text_forgot_password</Text.H6>
      <Text.BodyS useI18n style={styles.desc}>
        auth:text_forgot_password_input_desc
      </Text.BodyS>
      <TextInput
        ref={refTextInput}
        testID="forgot_password.input_email"
        placeholder={t('auth:input_label_email')}
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus
        value={value}
        editable={!loadingRequest}
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
        useI18n
        testID="forgot_password.button_send"
        disabled={disableRequest}
        loading={loadingRequest}
        onPress={onRequestForgotPassword}
        style={styles.btnSendRecoverCode}
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
      marginTop: spacing.margin.extraLarge,
      marginBottom: spacing.margin.large,
      color: colors.neutral80,
    },
    btnSendRecoverCode: {
      marginTop: spacing.margin.large,
    },
  });
};

export default EmailInputView;
