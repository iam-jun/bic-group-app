import React, { useEffect, useRef } from 'react';
import {
  Keyboard, StyleSheet, TouchableWithoutFeedback, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import * as validation from '~/constants/commonRegex';
import { useBaseHook } from '~/hooks';
import { IObject } from '~/interfaces/common';
import TextInputController from '~/beinComponents/inputs/TextInputController';
import useForgotPasswordStore, { IForgotPasswordState } from '../../../store';
import { spacing } from '~/theme';
import { useKeyboardStatus } from '~/hooks/keyboard';
import useIsFirstRender from '~/hooks/useIsFirstRender';
import Icon from '~/baseComponents/Icon';
import { FieldNameType } from '~/interfaces/IAuth';

const MAX_LENGTH_INPUT = 6;

interface Props {
  useFormData: IObject<any>;
}

const CodeInput: React.FC<Props> = ({ useFormData }) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const { t } = useBaseHook();
  const styles = themeStyles(theme);
  const codeInputRef = useRef<any>(null);

  const errorConfirm = useForgotPasswordStore((state: IForgotPasswordState) => state.errorConfirm);
  const { isOpen: isOpenKeyBoard } = useKeyboardStatus();
  const isFirst = useIsFirstRender();

  const { getValues, trigger } = useFormData;

  const code = getValues(FieldNameType.CODE);

  useEffect(() => {
    codeInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (codeInputRef.current?.isFocused() && !isOpenKeyBoard && !isFirst) {
      Keyboard.dismiss();
    }
  }, [isOpenKeyBoard]);

  const validateCode = async () => {
    await trigger(FieldNameType.CODE);
  };

  const onFocusCodeInput = () => {
    if (!codeInputRef.current.isFocused()) {
      codeInputRef.current.focus();
    }
  };

  const renderTextError = () => {
    if (errorConfirm) {
      return (
        <View testID="forgot_password.text_error" style={styles.containerError}>
          <Icon
            icon="iconCircleExclamation"
            size={14}
            tintColor={colors.red40}
          />
          <Text.BodyS style={styles.textError}>{errorConfirm}</Text.BodyS>
        </View>
      );
    }
  };

  return (
    <>
      <TextInputController
        testID="forgot_password.input_code"
        useFormData={useFormData}
        name={FieldNameType.CODE}
        rules={{
          required: t('auth:text_err_code'),
          pattern: {
            value: validation.codeRegex,
            message: t('auth:text_err_code'),
          },
        }}
        validateValue={validateCode}
        placeholder={t('auth:input_label_code')}
        keyboardType="numeric"
        style={styles.codeInputHide}
        maxLength={MAX_LENGTH_INPUT}
        ref={codeInputRef}
      />
      <View style={styles.containerCodeInput}>
        {Array(MAX_LENGTH_INPUT)
          .fill(0)
          .map((item, index) => (
            <TouchableWithoutFeedback key={index} onPress={onFocusCodeInput}>
              <View style={styles.cellView}>
                <Text.SubtitleL>{code && code.length > index ? code[index] : '_'}</Text.SubtitleL>
              </View>
            </TouchableWithoutFeedback>
          ))}
      </View>
      {renderTextError()}
    </>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    codeInputHide: {
      position: 'absolute',
      left: -1000,
      top: 100,
      width: 0,
      height: 0,
    },
    containerCodeInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cellView: {
      width: 40,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.neutral1,
      borderColor: colors.neutral5,
      borderWidth: 1,
      marginHorizontal: spacing.margin.tiny,
    },
    containerError: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: spacing.margin.small,
    },
    textError: {
      color: colors.red40,
      marginLeft: 5,
    },
  });
};

export default CodeInput;
