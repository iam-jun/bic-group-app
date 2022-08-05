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

export interface ButtonDangerProps extends ButtonWrapperProps {
  useI18n?: boolean;
}

const ButtonDanger: React.FC<ButtonDangerProps> = ({
  useI18n,
  children,
  style,
  disabled,
  ...props
}: ButtonDangerProps) => {
  const { colors }: ExtendedTheme = useTheme() as ExtendedTheme;

  const underlayColor = colors.neutral5;
  let backgroundColor = colors.red1;
  let textColor = colors.red60;

  if (disabled) {
    backgroundColor = colors.gray20;
    textColor = colors.gray40;
  }

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      backgroundColor,
      padding: spacing.padding.small,
      borderRadius: spacing.borderRadius.small,
      alignItems: 'center',
    },
    style,
  ]);

  return (
    <ButtonWrapper
      disabled={disabled}
      style={containerStyle}
      underlayColor={underlayColor}
      TouchableComponent={TouchableHighlight}
      {...props}
      textProps={{ color: textColor, useI18n, ...props?.textProps }}
    >
      {children}
    </ButtonWrapper>
  );
};

export default ButtonDanger;
