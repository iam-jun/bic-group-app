import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
  KeyboardTypeOptions,
  TextInput as RNTextInput,
} from 'react-native';
import {TextInput as TextInputPaper} from 'react-native-paper';
import {TextInputProps as TextInputPaperProps} from 'react-native-paper/lib/typescript/components/TextInput/TextInput';

import {fontFamilies} from '~/theme/fonts';
import Text, {TextProps} from '~/beinComponents/Text';
import Icon from '../Icon';
import spacing from '~/theme/spacing';
import {ExtendedTheme, useTheme} from '@react-navigation/native';

export type HelperType =
  | 'error'
  | 'warning'
  | 'success'
  | 'secondary'
  | undefined;

// @ts-ignore
export interface TextInputProps extends TextInputPaperProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  helperContent?: string;
  helperType?: HelperType;
  helperError?: string;
  helperTextProps?: TextProps;
  helperAction?: string;
  helperActionOnPress?: () => void;
  theme?: ExtendedTheme;
  placeholder?: string;
  label?: string;
  error?: boolean;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  editable?: boolean;
  value?: string;
  onChangeText?: ((text: string) => void) | undefined;
  clearText?: boolean;
  textInputRef?: React.Ref<RNTextInput>;
  textColor?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  style,
  inputStyle,
  helperType,
  helperContent,
  helperTextProps,
  helperAction,
  helperActionOnPress,
  label,
  placeholder,
  error,
  disabled,
  value,
  onChangeText,
  clearText,
  textInputRef,
  textColor,
  ...props
}: TextInputProps) => {
  const theme: ExtendedTheme = useTheme() as ExtendedTheme;
  const {colors} = theme;
  const [text, setText] = useState<string>(value || '');

  useEffect(() => {
    setText(value || '');
  }, [value]);

  const customTheme = {
    colors: {
      primary: colors.gray40,
      text: error ? colors.red60 : textColor || colors.neutral80,
      placeholder: colors.gray50,
      background: disabled ? colors.gray20 : colors.white,
    },
    roundness: spacing.borderRadius.small,
    fonts: {
      regular: {
        fontFamily: fontFamilies.OpenSans,
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
        testID="text_input.text_helper_action"
        onPress={helperActionOnPress}
        {..._textHelperProps}
        style={helperActionStyle.style}>
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

  return (
    <View testID="text_input" style={[styles.container, style]}>
      <TextInputPaper
        testID="text_input.input"
        label={label}
        placeholder={placeholder}
        selectionColor={colors.gray50}
        // @ts-ignore
        outlineColor={colors.neutral80}
        mode={'outlined'}
        theme={customTheme}
        dense
        error={error}
        disabled={disabled}
        placeholderTextColor={colors.gray50}
        value={text}
        style={[styles.input, inputStyle]}
        onChangeText={_onChangeText}
        right={
          clearText &&
          !!text && (
            <TextInputPaper.Icon
              name={() => (
                <Icon
                  testID="text_input.clear_icon"
                  icon="iconClose"
                  size={14}
                  onPress={_onClearText}
                />
              )}
            />
          )
        }
        ref={textInputRef}
        {...props}
      />
      {!!helperContent && (
        <Text.Subtitle testID="text_input.text_helper" {..._textHelperProps}>
          {helperContent}
          {renderHelperAction()}
        </Text.Subtitle>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing?.margin.tiny,
  },
  input: {},
  iconClear: {
    position: 'absolute',
    right: spacing.margin.large,
    // @ts-ignore
    top: spacing.margin.base + spacing.margin.small || 13,
  },
});

const getTextHelperProps = (theme: ExtendedTheme, type: HelperType) => {
  const {colors} = theme;
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
  style: {textDecorationLine: 'underline'},
});

const _TextInput = React.forwardRef(
  (props: TextInputProps, ref?: React.Ref<RNTextInput>) => (
    <TextInput textInputRef={ref} {...props} />
  ),
);

export default React.memo(_TextInput);
