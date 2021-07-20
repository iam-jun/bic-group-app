import React from 'react';
import {
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
  KeyboardTypeOptions,
} from 'react-native';
import {TextInput as TextInputPaper, useTheme} from 'react-native-paper';
import {TextInputProps as TextInputPaperProps} from 'react-native-paper/lib/typescript/components/TextInput/TextInput';

import {ITheme} from '~/theme/interfaces';
import {fontFamilies} from '~/theme/fonts';
import Text, {TextProps} from '~/beinComponents/Text';

export type HelperType =
  | 'error'
  | 'warning'
  | 'success'
  | 'secondary'
  | undefined;

// @ts-ignore
export interface TextInputProps extends TextInputPaperProps {
  style?: StyleProp<ViewStyle>;
  helperContent?: string;
  helperType?: HelperType;
  helperError?: string;
  helperTextProps?: TextProps;
  helperAction?: string;
  helperActionOnPress?: () => void;

  theme?: ITheme;
  placeholder?: string;
  label?: string;
  error?: boolean;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  editable?: boolean;
  onChangeText?: ((text: string) => void) | undefined;
}

const TextInput: React.FC<TextInputProps> = ({
  style,
  helperType,
  helperContent,
  helperTextProps,
  helperAction,
  helperActionOnPress,

  label,
  placeholder,
  error,
  disabled,
  ...props
}: TextInputProps) => {
  const theme: ITheme = useTheme();
  const {spacing, colors} = theme;

  const customTheme = {
    colors: {
      primary: colors.borderFocus,
      text: error ? colors.error : colors.textPrimary,
      placeholder: colors.textSecondary,
      background: disabled ? colors.bgDisable : colors.background,
    },
    roundness: spacing?.borderRadius.small,
    fonts: {
      regular: {
        fontFamily: fontFamilies.Segoe,
      },
    },
  };

  if (error) {
    helperType = 'error';
  }
  const _textHelperProps = Object.assign(
    getTextHelperProps(theme, helperType),
    helperTextProps,
  );

  const renderHelperAction = () => {
    if (!helperAction) {
      return null;
    }

    return (
      <Text.H6
        onPress={helperActionOnPress}
        {..._textHelperProps}
        style={{textDecorationLine: 'underline'}}>
        {`${helperAction}`}
      </Text.H6>
    );
  };

  return (
    <View
      style={StyleSheet.flatten([
        {marginVertical: spacing?.margin.tiny},
        style,
      ])}>
      <TextInputPaper
        label={label}
        placeholder={placeholder}
        selectionColor={colors.textInput}
        outlineColor={disabled ? colors.bgDisable : colors.textInput}
        mode={'outlined'}
        theme={customTheme}
        dense
        error={error}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      <Text.Subtitle {..._textHelperProps}>
        {helperContent}
        {renderHelperAction()}
      </Text.Subtitle>
    </View>
  );
};

const getTextHelperProps = (theme: ITheme, type: HelperType) => {
  const {colors} = theme;
  const props = {
    error: {
      color: colors.error,
    },
    warning: {
      color: colors.warning,
    },
    success: {
      color: colors.success,
    },
    secondary: {
      color: colors.textSecondary,
    },
  };
  return props[type || 'secondary'] || props.secondary;
};

export default TextInput;
