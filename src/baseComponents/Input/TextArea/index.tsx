import React, { useEffect, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Text from '~/baseComponents/Text';
import { fontFamilies } from '~/theme/fonts';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';
import Icon from '~/baseComponents/Icon';

export interface TextAreaProps extends RNTextInputProps {
  maxLength?: number;
  style?: StyleProp<ViewStyle>;
  inputStyleContainer?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  label?: string;
  placeholder?: string;
  textColor?: string;
  activeOutlineColor?: string;
  outlineColor?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText?: (text: string) => void;
  showCountLength?: boolean;
  errorText?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  showCountLength = true,
  maxLength = 255,
  value = '',
  label,
  style,
  inputStyleContainer,
  inputStyle,
  activeOutlineColor,
  outlineColor,
  onFocus,
  onBlur,
  onChangeText,
  errorText,
  ...props
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(theme);
  const [text, setText] = useState<string>(value);
  const [isFocus, setIsFocus] = useState<boolean>(false);

  useEffect(() => {
    setText(value || '');
  }, [value]);

  const _onChangeText = (text: string) => {
    setText(text);
    onChangeText && onChangeText(text);
  };

  const _onFocus = () => {
    onFocus?.();
    setIsFocus(true);
  };

  const _onBlur = () => {
    onBlur?.();
    setIsFocus(false);
  };

  return (
    <View testID="text_input.text_area" style={[styles.container, style]}>
      {!!label && (
        <Text.LabelM color={colors.neutral80} style={styles.lableStyle}>
          {label}
        </Text.LabelM>
      )}
      <View
        style={[
          styles.textInputView,
          {
            borderColor: !!errorText ? colors.red40 : isFocus
              ? activeOutlineColor || colors.purple50
              : outlineColor || colors.neutral5,
          },
          inputStyleContainer,
        ]}
      >
        <RNTextInput
          value={text}
          maxLength={maxLength}
          testID="text_input.text_area.input"
          placeholderTextColor={colors.neutral20}
          style={[styles.textInput, inputStyle]}
          multiline
          textAlignVertical="top"
          onChangeText={_onChangeText}
          onFocus={_onFocus}
          onBlur={_onBlur}
          selectionColor={colors.gray50}
          {...props}
        />
      </View>
      <View style={styles.row}>
        {!!errorText ? (
          <View style={styles.errorView}>
            <Icon icon="CircleExclamation" size={14} tintColor={colors.red40} />
            <Text.BodyXS style={styles.errorText}>{errorText}</Text.BodyXS>
          </View>
        ) : (
          <View />
        )}
        {showCountLength && (
          <Text.BodyXS color={colors.neutral20}>
            {`${text?.trim?.()?.length}/${maxLength}`}
          </Text.BodyXS>
        )}
      </View>
    </View>
  );
};

const themeStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      padding: spacing.margin.large,
    },
    lableStyle: {
      marginBottom: spacing.margin.small,
    },
    textInput: {
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyM,
      color: colors.neutral40,
      flex: 1,
    },
    textInputView: {
      borderRadius: spacing.borderRadius.small,
      borderColor: colors.neutral5,
      borderWidth: 1,
      paddingHorizontal: spacing.margin.base,
      paddingVertical: spacing.margin.xSmall,
      minHeight: 84,
      marginBottom: spacing.margin.xSmall,
    },
    countNumber: {
      alignSelf: 'flex-end',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.margin.tiny,
    },
    errorView: {
      flexDirection: 'row',
      flex: 1,
      marginRight: spacing.margin.small,
    },
    errorText: {
      color: colors.red40,
      marginLeft: spacing.margin.tiny,
    },
  });
};

export default TextArea;
