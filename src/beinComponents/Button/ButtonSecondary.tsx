import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableHighlight,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ButtonPrimaryProps} from '~/beinComponents/Button/ButtonPrimary';
import {ITheme} from '~/theme/interfaces';
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
  const {colors, spacing}: ITheme = useTheme() as ITheme;

  const _colorHover = colorHover || colors.primary2;
  let _backgroundColor = color || colors.bgButtonSecondary;
  let _textColor = textColor || colors.primary;

  if (highEmphasis) {
    _backgroundColor = colors.primary7;
    _textColor = colors.background;
  } else if (disabled) {
    _backgroundColor = colorDisabled || colors.bgDisable;
    // @ts-ignore
    _textColor = textColorDisabled || colors.textDisabled;
  }

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      backgroundColor: _backgroundColor,
      padding: spacing?.padding.base,
      borderRadius: borderRadius || spacing?.borderRadius.small,
      alignItems: 'center',
    },
    style,
  ]);

  return (
    <ButtonWrapper
      disabled={disabled}
      style={containerStyle}
      textProps={{color: _textColor, useI18n}}
      underlayColor={_colorHover}
      TouchableComponent={TouchableHighlight}
      {...props}>
      {children}
    </ButtonWrapper>
  );
};

export default ButtonSecondary;
