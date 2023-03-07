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
import Text, { TextProps } from '~/baseComponents/Text';
import spacing from '~/theme/spacing';
import Icon, { IconProps } from '~/baseComponents/Icon';
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
  labelProps?: TextProps;
  helperText?: string;
  helperType?: HelperType;
  helperError?: string;
  helperTextProps?: TextProps;
  helperStyle?: StyleProp<ViewStyle>;
  helperAction?: string;
  placeholder?: string;
  error?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  value?: string;
  textInputRef?: React.Ref<RNTextInput>;
  textColor?: string;
  RightComponent?: React.ReactNode | React.ReactElement;
  activeOutlineColor?: string;
  outlineColor?: string;
  helperTextTriggerAction?: any;
  horizontal?: boolean;
  leftIcon?: IconType;
  leftIconProps?: IconProps;

  onFocus?: () => void;
  onBlur?: () => void;
  onChangeText?: ((text: string) => void) | undefined;
  helperActionOnPress?: () => void;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  labelProps,
  style,
  inputStyle,
  helperType,
  helperText,
  helperTextProps,
  helperStyle,
  helperAction,
  placeholder,
  error,
  value,
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
    theme, horizontal, leftIcon,
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
        {helperAction}
      </Text.H6>
    );
  };

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

  const getBorderColor = () => {
    if (error) return colors.red40;
    if (!editable) return colors.neutral5;
    if (isFocus) return !!activeOutlineColor ? activeOutlineColor : colors.purple50;
    return !!outlineColor ? outlineColor : colors.neutral5;
  };

  return (
    <View testID="text_input" style={[styles.container, style]}>
      {!!label && (
        <View style={styles.labelStyle}>
          <Text.LabelM color={colors.neutral80} {...labelProps}>{label}</Text.LabelM>
        </View>
      )}
      <View style={[!!horizontal ? { flex: 1 } : {}]}>
        <View style={[styles.row]}>
          {!!leftIcon && (
            <View style={styles.leftIconStyle}>
              <Icon
                testID="text_input.left_icon"
                icon={leftIcon}
                size={22}
                tintColor={colors.neutral20}
                {...leftIconProps}
              />
            </View>
          )}
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: !editable ? colors.neutral2 : colors.white,
                borderColor: getBorderColor(),
              },
              inputStyle,
            ]}
          >
            <View style={styles.inputContainer}>
              <RNTextInput
                testID="text_input.input"
                placeholder={placeholder}
                selectionColor={colors.gray50}
                placeholderTextColor={colors.neutral20}
                value={text}
                style={[
                  styles.input,
                  { color: !editable ? (textColor || colors.neutral40) : (textColor || colors.neutral80) },
                ]}
                onChangeText={_onChangeText}
                ref={textInputRef}
                onFocus={_onFocus}
                onBlur={_onBlur}
                editable={editable}
                {...props}
              />
              {!!RightComponent && (
                <View style={styles.rightComponentStyle}>
                  {RightComponent}
                </View>
              )}
            </View>
          </View>
        </View>
        {!!helperText && (
          <View style={[styles.helperContainer, helperStyle]}>
            {!!error && (
              <Icon
                testID="text_input.error_icon"
                icon="CircleExclamation"
                size={14}
                tintColor={colors.red40}
                style={styles.errorIconStyle}
              />
            )}
            <View style={styles.helperTextStyle}>
              <Text.BodyXS testID="text_input.text_helper" {..._textHelperProps}>
                {helperText}
                {renderHelperAction()}
              </Text.BodyXS>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const themeStyles = (
  theme: ExtendedTheme, horizontal: boolean, leftIcon: string,
) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: !horizontal ? 'column' : 'row',
      marginVertical: spacing?.margin.tiny,
    },
    row: {
      height: 40,
      flexDirection: 'row',
    },
    inputRow: {
      flexDirection: 'row',
      borderTopLeftRadius: !!leftIcon ? 0 : spacing.borderRadius.base,
      borderBottomLeftRadius: !!leftIcon ? 0 : spacing.borderRadius.base,
      borderTopRightRadius: spacing.borderRadius.base,
      borderBottomRightRadius: spacing.borderRadius.base,
      borderWidth: 1,
      flex: 1,
    },
    inputContainer: {
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    input: {
      height: 40,
      paddingHorizontal: spacing.padding.large,
      fontFamily: fontFamilies.BeVietnamProLight,
      fontSize: dimension.sizes.bodyM,
      flex: 1,
    },
    labelStyle: {
      marginRight: !!horizontal ? spacing.margin.big : 0,
      marginBottom: !horizontal ? spacing.margin.small : 0,
      maxWidth: horizontal ? dimension.deviceWidth / 3 : dimension.deviceWidth,
    },
    errorIconStyle: {},
    helperTextStyle: {
      paddingHorizontal: spacing.padding.tiny,
      flex: 1,
    },
    helperContainer: {
      flexDirection: 'row',
      marginTop: spacing.margin.tiny,
      alignContent: 'center',
      paddingRight: spacing.padding.tiny,
    },
    leftIconStyle: {
      backgroundColor: colors.neutral2,
      borderColor: colors.neutral5,
      borderWidth: 1,
      borderTopLeftRadius: spacing.borderRadius.base,
      borderBottomLeftRadius: spacing.borderRadius.base,
      padding: spacing.padding.small,
    },
    rightComponentStyle: {
      paddingRight: spacing.margin.base,
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
