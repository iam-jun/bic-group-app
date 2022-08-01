import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableHighlight,
  ViewStyle,
} from 'react-native';

import { ButtonPrimaryProps } from '~/beinComponents/Button/ButtonPrimary';
import spacing from '~/theme/spacing';
import ButtonWrapper from './ButtonWrapper';

export interface ButtonSecondaryProps extends ButtonPrimaryProps {
  highEmphasis?: boolean;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
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
  highEmphasis = false,
  ...props
}: ButtonSecondaryProps) => {
  const { colors }: ExtendedTheme = useTheme() as ExtendedTheme;

  let _colorHover = colorHover || colors.purple5;
  let _backgroundColor = color || colors.white;
  let _textColor = textColor || colors.purple50;

  if (highEmphasis) {
    _backgroundColor = colors.purple30;
    _textColor = colors.white;
    _colorHover = colors.purple50;
  }

  if (disabled) {
    _backgroundColor = colorDisabled || colors.gray20;
    // @ts-ignore
    _textColor = textColorDisabled || colors.gray40;
  }

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      backgroundColor: _backgroundColor,
      padding: spacing.padding.small,
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

export default ButtonSecondary;
