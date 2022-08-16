import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  KeyboardTypeOptions,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  View,
} from 'react-native';

import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { fontFamilies } from '~/theme/fonts';
import Text, { TextProps } from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import Icon, { IconProps } from '~/beinComponents/Icon';
import { getTextHelperColor } from '../helper';
import dimension from '~/theme/dimension';
import { IconType } from '~/resources/icons';

export type HelperType =
  | 'error'
  | 'warning'
  | 'success'
  | 'secondary'
  | undefined;

export interface TextInputProps extends RNTextInputProps {
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  label?: string,
  helperText?: string;
  helperType?: HelperType;
  helperError?: string;
  helperTextProps?: TextProps;
  helperAction?: string;
  placeholder?: string;
  error?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
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
  helperTextTriggerAction?: any;
  horizontal?: boolean;
  leftIcon?: IconType;
  leftIconProps?: IconProps;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  style,
  inputStyle,
  helperType,
  helperText,
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
  editable = true,
  horizontal,
  leftIcon,
  leftIconProps,
  onFocus,
  onBlur,
  onChangeText,
  helperActionOnPress,
  ...props
}: TextInputProps) => {
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = themeStyles(
    theme, horizontal, textColor,
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

  const textHelperColor = getTextHelperColor(
    theme, helperType,
  );
  const _textHelperProps = {
    ...textHelperColor,
    ...helperTextProps,
  };

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
      {!!label && (
      <View style={styles.labelStyle}>
        <Text.LabelM color={colors.neutral80}>{label}</Text.LabelM>
      </View>
      )}
      <View>
        <View
          style={[
            styles.row,
            {
              backgroundColor: !editable ? colors.neutral2 : colors.white,
              borderColor: !editable ? colors.neutral5 : isFocus
                ? activeOutlineColor || colors.purple50
                : outlineColor || colors.neutral5,
            },
            inputStyle,
          ]}
        >
          {!!leftIcon && (
          <View style={styles.leftIconStyle}>
            <Icon
              testID="text_input.left_icon"
              icon={leftIcon}
              size={24}
              tintColor={colors.neutral20}
              {...leftIconProps}
            />
          </View>
          )}
          <View style={styles.inputContainer}>
            <RNTextInput
              testID="text_input.input"
              placeholder={placeholder}
              selectionColor={colors.gray50}
              placeholderTextColor={colors.neutral20}
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
        </View>
        {!!helperText && (
          <View style={styles.helperContainer}>
            {!!error && (
            <Icon
              testID="text_input.error_icon"
              icon="CircleExclamation"
              size={16}
              tintColor={colors.red40}
              style={styles.errorIconStyle}
            />
            )}
            <Text.BodyXS testID="text_input.text_helper" {..._textHelperProps}>
              {helperText}
              {renderHelperAction()}
            </Text.BodyXS>
          </View>
        )}
      </View>
    </View>
  );
};

const themeStyles = (
  theme: ExtendedTheme, horizontal:boolean, textColor?: string,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: !horizontal ? 'column' : 'row',
      marginVertical: spacing?.margin.tiny,
    },
    row: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: spacing.borderRadius.base,
      borderWidth: 1,
      paddingRight: spacing.padding.base,
    },
    inputContainer: {
    },
    input: {
      minHeight: 40,
      paddingHorizontal: spacing.padding.large,
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
    labelStyle: {
      marginRight: !!horizontal ? spacing.margin.big : 0,
      marginBottom: !horizontal ? spacing.margin.small : 0,
      maxWidth: horizontal ? dimension.deviceWidth / 3 : dimension.deviceWidth,
    },
    errorIconStyle: {
      marginRight: spacing.margin.tiny,
    },
    helperContainer: {
      flexDirection: 'row',
      marginTop: spacing.margin.tiny,
      alignContent: 'center',
    },
    leftIconStyle: {
      backgroundColor: colors.neutral2,
      borderRightColor: colors.neutral5,
      borderRightWidth: 1,
      padding: spacing.padding.small,
    },
  });
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
