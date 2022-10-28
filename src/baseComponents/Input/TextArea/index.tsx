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

import Text from '~/beinComponents/Text';
import { fontFamilies } from '~/theme/fonts';
import spacing from '~/theme/spacing';
import dimension from '~/theme/dimension';

export interface TextAreaProps extends RNTextInputProps {
  maxLength?:number,
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  label?: string,
  placeholder?: string;
  textColor?: string;
  activeOutlineColor?: string;
  outlineColor?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText?: ((text: string) => void) | undefined;
}

const TextArea : React.FC<TextAreaProps> = ({
  maxLength = 255,
  value,
  label,
  style,
  inputStyle,
  activeOutlineColor,
  outlineColor,
  onFocus,
  onBlur,
  onChangeText,
  ...props
}) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(
    theme,
  );
  const [text, setText] = useState<string>(value || '');
  const [isFocus, setIsFocus] = useState<boolean>(false);

  useEffect(
    () => {
      setText(value || '');
    }, [value],
  );

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
      {!!label && <Text.LabelM color={colors.neutral80} style={styles.lableStyle}>{label}</Text.LabelM>}
      <View
        style={[styles.textInputView, {
          borderColor: isFocus ? activeOutlineColor || colors.purple50
            : outlineColor || colors.neutral5,
        }, inputStyle]}
      >
        <RNTextInput
          value={text}
          maxLength={maxLength}
          testID="text_input.text_area.input"
          placeholderTextColor={colors.neutral20}
          style={styles.textInput}
          multiline
          textAlignVertical="top"
          onChangeText={_onChangeText}
          onFocus={_onFocus}
          onBlur={_onBlur}
          selectionColor={colors.gray50}
          {...props}
        />
      </View>
      <Text.BodyXS color={colors.neutral20} style={styles.countNumber}>
        {`${text?.trim?.()?.length}/${maxLength}`}
      </Text.BodyXS>
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
  });
};

export default TextArea;
