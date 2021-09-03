import React, {useState} from 'react';
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
import Icon from '../Icon';

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
  value?: string;
  onChangeText?: ((text: string) => void) | undefined;
  clearText?: boolean;
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
  value,
  onChangeText,
  clearText,
  ...props
}: TextInputProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const {spacing, colors} = theme;
  const [text, setText] = useState<string>(value || '');

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

  const styles = createStyles(theme);

  const renderHelperAction = () => {
    if (!helperAction) {
      return null;
    }

    return (
      <Text.H6
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
    <View
      style={StyleSheet.flatten([
        {marginVertical: spacing?.margin.tiny},
        style,
      ])}>
      <TextInputPaper
        label={label}
        placeholder={placeholder}
        selectionColor={colors.textInput}
        // @ts-ignore
        outlineColor={colors.textInput}
        mode={'outlined'}
        theme={customTheme}
        dense
        error={error}
        disabled={disabled}
        placeholderTextColor={colors.textSecondary}
        {...props}
        value={text}
        style={styles.input}
        onChangeText={_onChangeText}
        right={
          clearText &&
          !!text && (
            <TextInputPaper.Icon
              name={() => (
                <Icon icon="iconClose" size={14} onPress={_onClearText} />
              )}
            />
          )
        }
      />
      {!!helperContent && (
        <Text.Subtitle {..._textHelperProps}>
          {helperContent}
          {renderHelperAction()}
        </Text.Subtitle>
      )}
    </View>
  );
};

const createStyles = (theme: ITheme) => {
  const {spacing} = theme;

  return StyleSheet.create({
    input: {},
    iconClear: {
      position: 'absolute',
      right: spacing.margin.large,
      // @ts-ignore
      top: spacing.margin.base + spacing.margin.small || 13,
    },
  });
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

const helperActionStyle = StyleSheet.create({
  style: {textDecorationLine: 'underline'},
});

export default TextInput;
