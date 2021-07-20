import React from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import ButtonPrimary, {
  ButtonPrimaryProps,
} from '~/beinComponents/Button/ButtonPrimary';
import {ITheme} from '~/theme/interfaces';

const ButtonSecondary: React.FC<ButtonPrimaryProps> = ({
  color,
  colorHover,
  colorDisabled,
  textColor,
  textColorDisabled,
  style,
  ...props
}: ButtonPrimaryProps) => {
  const {colors, spacing}: ITheme = useTheme();

  return (
    <ButtonPrimary
      color={color || colors.bgButtonSecondary}
      colorHover={colorHover || colors.primary2}
      colorDisabled={colorDisabled}
      textColor={textColor || colors.primary}
      textColorDisabled={textColorDisabled}
      style={StyleSheet.flatten([{padding: spacing?.padding.small}, style])}
      {...props}
    />
  );
};

export default ButtonSecondary;
