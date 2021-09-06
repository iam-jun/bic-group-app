import React from 'react';
import ButtonBottomFixed, {ButtonBottomFixedProps} from './ButtonBottomFixed';
import {StyleSheet} from 'react-native';
import {ButtonPrimaryProps} from '~/beinComponents/Button/ButtonPrimary';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';

export interface ButtonBottomSecondaryProps
  extends ButtonPrimaryProps,
    ButtonBottomFixedProps {}

const ButtonBottomSecondary: React.FC<ButtonBottomSecondaryProps> = ({
  color,
  colorHover,
  colorDisabled,
  textColor,
  textColorDisabled,
  style,
  ...props
}: ButtonBottomSecondaryProps) => {
  const {colors, spacing}: ITheme = useTheme() as ITheme;

  return (
    <ButtonBottomFixed
      linearHeight={24}
      color={color || colors.bgButtonSecondary}
      colorHover={colorHover || colors.primary2}
      colorDisabled={colorDisabled}
      textColor={textColor || colors.primary5}
      textColorDisabled={textColorDisabled}
      style={StyleSheet.flatten([{padding: spacing?.padding.small}, style])}
      bottomButtonStyle={{
        paddingHorizontal: spacing?.padding.base,
        paddingVertical: spacing?.padding.small,
      }}
      {...props}
    />
  );
};

export default ButtonBottomSecondary;
