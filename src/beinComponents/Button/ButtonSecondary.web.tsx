import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import ButtonPrimary, {
  ButtonPrimaryProps,
} from '~/beinComponents/Button/ButtonPrimary';
import {ITheme} from '~/theme/interfaces';

export interface ButtonSecondaryProps extends ButtonPrimaryProps {
  highEmphasis?: boolean;
}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  color,
  colorHover,
  colorDisabled,
  textColor,
  textColorDisabled,
  style,
  highEmphasis = false,
  ...props
}: ButtonSecondaryProps) => {
  const {colors, spacing}: ITheme = useTheme() as ITheme;

  let _backgroundColor = color || colors.bgButtonSecondary;
  let _textColor = textColor || colors.primary;
  if (highEmphasis) {
    _backgroundColor = colors.primary7;
    _textColor = colors.background;
  }

  return (
    <ButtonPrimary
      color={_backgroundColor}
      colorHover={colorHover || colors.primary2}
      colorDisabled={colorDisabled}
      textColor={_textColor}
      textColorDisabled={textColorDisabled}
      style={StyleSheet.flatten([{padding: spacing?.padding.small}, style])}
      {...props}
    />
  );
};

export default ButtonSecondary;
