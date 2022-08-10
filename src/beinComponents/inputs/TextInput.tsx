import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
  KeyboardTypeOptions,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { fontFamilies } from '~/theme/fonts';
import Text, { TextProps } from '~/beinComponents/Text';
import Icon from '../Icon';
import spacing from '~/theme/spacing';

export type HelperType =
  | 'error'
  | 'warning'
  | 'success'
  | 'secondary'
  | undefined;

export interface TextInputProps extends RNTextInputProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  helperContent?: string;
  helperType?: HelperType;
  helperError?: string;
  helperTextProps?: TextProps;
  helperAction?: string;
  placeholder?: string;
  error?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  editable?: boolean;
  value?: string;
  clearText?: boolean;
  textInputRef?: React.Ref<RNTextInput>;
  textColor?: string;
  RightComponent?: React.ReactNode | React.ReactElement;
  activeOutlineColor?: string;
  outlineColor?: string;

  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText?: ((text: string) => void) | undefined;
  helperActionOnPress?: () => void;
  helperContentTriggerAction?: any;
}

const TextInput: React.FC<TextInputProps> = ({
  style,
  inputStyle,
  helperType,
  helperContent,
  helperTextProps,
  helperAction,
  placeholder,
  error,
  value,
  clearText,
  textInputRef,
  textColor,
  RightComponent,
  activeOutlineColor,
  outlineColor,

  onFocus,
  onBlur,
  onChangeText,
  helperActionOnPress,
  ...props
}: TextInputProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(
    theme, textColor,
  );
  const [text, setText] = useState<string>(value || '');
  const [isFocus, setIsFocus] = useState<boolean>(false);

  useEffect(
    () => {
      setText(value || '');
    }, [value],
  );

  if (error) {
    helperType = 'error';
  }
  const _textHelperProps = Object.assign(
    getTextHelperProps(
      theme, helperType,
    ),
    helperTextProps,
  );

  const renderHelperAction = () => {
    if (!helperAction) {
      return null;
    }

    return (
      <Text.H6
        testID="text_input.text_helper_action"
        onPress={helperActionOnPress}
        {..._textHelperProps}
        style={helperActionStyle.style}
      >
        {`${helperAction}`}
      </Text.H6>
    );
  };

  const _onChangeText = (text: string) => {
    setText(text);
    onChangeText && onChangeText(text);
  };

  const _onClearText = () => {
    _onChangeText('');
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
    <View testID="text_input" style={[styles.container, style]}>
      <View
        style={[
          styles.row,
          {
            borderColor: isFocus
              ? activeOutlineColor || colors.gray40
              : outlineColor || colors.gray40,
          },
          inputStyle,
        ]}
      >
        <RNTextInput
          testID="text_input.input"
          placeholder={placeholder}
          selectionColor={colors.gray50}
          placeholderTextColor={colors.gray50}
          value={text}
          style={[
            styles.input,
            error ? styles.errorStyle : styles.defaultStyle,
          ]}
          onChangeText={_onChangeText}
          ref={textInputRef}
          onFocus={_onFocus}
          onBlur={_onBlur}
          {...props}
        />
        {RightComponent}
        {clearText && !!text && (
          <Icon
            testID="text_input.clear_icon"
            icon="iconClose"
            size={14}
            onPress={_onClearText}
          />
        )}
      </View>
      {!!helperContent && (
        <Text.BodyS testID="text_input.text_helper" {..._textHelperProps}>
          {helperContent}
          {renderHelperAction()}
        </Text.BodyS>
      )}
    </View>
  );
};

const themeStyles = (
  theme: ExtendedTheme, textColor?: string,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      marginVertical: spacing?.margin.tiny,
    },
    row: {
      minHeight: 44,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: spacing.borderRadius.small,
      borderWidth: 1,
      borderColor: colors.gray40,
      paddingRight: spacing.padding.base,
    },
    input: {
      minHeight: 44,
      paddingHorizontal: spacing.padding.base,
      fontFamily: fontFamilies.BeVietnamProLight,
      flex: 1,
    },
    defaultStyle: {
      color: textColor || colors.neutral80,
    },
    errorStyle: {
      color: colors.red60,
    },
    iconClear: {
      position: 'absolute',
      right: spacing.margin.large,
      top: spacing.margin.base + spacing.margin.small || 13,
    },
  });
};

const getTextHelperProps = (
  theme: ExtendedTheme, type: HelperType,
) => {
  const { colors } = theme;
  const props = {
    error: {
      color: colors.red60,
    },
    warning: {
      color: colors.warning,
    },
    success: {
      color: colors.success,
    },
    secondary: {
      color: colors.gray50,
    },
  };
  return props[type || 'secondary'] || props.secondary;
};

const helperActionStyle = StyleSheet.create({
  style: { textDecorationLine: 'underline' },
});

const _TextInput = React.forwardRef((
  props: TextInputProps, ref?: React.Ref<RNTextInput>,
) => (
  <TextInput textInputRef={ref} {...props} />
));

export default React.memo(_TextInput);
