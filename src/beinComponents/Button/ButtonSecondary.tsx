import React from 'react';
import ButtonPrimary, {
  ButtonPrimaryProps,
} from '~/beinComponents/Button/ButtonPrimary';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

const ButtonSecondary: React.FC<ButtonPrimaryProps> = ({
  color,
  colorHover,
  colorDisabled,
  textColor,
  textColorDisabled,
  ...props
}: ButtonPrimaryProps) => {
  const {colors}: ITheme = useTheme();

  return (
    <ButtonPrimary
      color={color || colors.bgButtonSecondary}
      colorHover={colorHover || colors.primary2}
      colorDisabled={colorDisabled}
      textColor={textColor || colors.primary}
      textColorDisabled={textColorDisabled}
      {...props}
    />
  );
};

export default ButtonSecondary;
