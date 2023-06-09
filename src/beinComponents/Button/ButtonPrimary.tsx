import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableHighlight,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import ButtonWrapper, {
  ButtonWrapperProps,
} from '~/beinComponents/Button/ButtonWrapper';
import spacing from '~/theme/spacing';

export interface ButtonPrimaryProps extends ButtonWrapperProps {
  color?: string;
  colorHover?: string;
  colorDisabled?: string;
  textColor?: string;
  textColorDisabled?: string;
  useI18n?: boolean;
  borderRadius?: number;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  color,
  colorHover,
  colorDisabled,
  textColor,
  textColorDisabled,
  useI18n,
  borderRadius,
  children,
  style,
  disabled,
  ...props
}: ButtonPrimaryProps) => {
  const { colors }: ExtendedTheme = useTheme();

  const _colorHover = colorHover || colors.neutral80;
  let _backgroundColor = color || colors.purple50;
  let _textColor = textColor || colors.white;
  if (disabled) {
    _backgroundColor = colorDisabled || colors.gray20;
    _textColor = textColorDisabled || colors.gray40;
  }

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      backgroundColor: _backgroundColor,
      paddingHorizontal: spacing.padding.base,
      paddingVertical: spacing.padding.small,
      borderRadius: borderRadius || spacing.borderRadius.small,
      alignItems: 'center',
    },
    style,
  ]);

  return (
    <ButtonWrapper
      disabled={disabled}
      style={containerStyle}
      underlayColor={_colorHover}
      TouchableComponent={TouchableHighlight}
      {...props}
      textProps={{ color: _textColor, useI18n, ...props?.textProps }}
    >
      {children}
    </ButtonWrapper>
  );
};

export default ButtonPrimary;
