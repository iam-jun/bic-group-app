import React from 'react';
import {
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import ButtonWrapper, {
  ButtonWrapperProps,
} from '~/beinComponents/Button/ButtonWrapper';
import spacing from '~/theme/spacing';

export interface ButtonPrimaryProps extends ButtonWrapperProps {
  type: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  children,
  style,
  type,
  ...props
}: ButtonPrimaryProps) => {
  const { colors }: ExtendedTheme = useTheme() as ExtendedTheme;

  const containerStyle: StyleProp<ViewStyle> = [
    {
      backgroundColor: colors.purple50,
      paddingHorizontal: spacing.padding.base,
      paddingVertical: spacing.padding.small,
      alignItems: 'center',
    },
    style,
  ]

  return (
    <ButtonWrapper
      style={containerStyle}
      {...props}
      textProps={{ color: _textColor, ...props?.textProps }}
    >
      {children}
    </ButtonWrapper>
  );
};

export default ButtonPrimary;
