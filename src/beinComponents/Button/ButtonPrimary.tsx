import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableHighlight,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import ButtonWrapper, {
  ButtonWrapperProps,
} from '~/beinComponents/Button/ButtonWrapper';
import {ITheme} from '~/theme/interfaces';

export interface ButtonPrimaryProps extends ButtonWrapperProps {
  color?: string;
  colorHover?: string;
  colorDisabled?: string;
  textColor?: string;
  textColorDisabled?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  color,
  colorHover,
  colorDisabled,
  textColor,
  textColorDisabled,
  children,
  style,
  disabled,
  ...props
}: ButtonPrimaryProps) => {
  const {colors, spacing}: ITheme = useTheme();

  const _colorHover = colorHover || colors.iconTint;
  let _backgroundColor = color || colors.bgButtonPrimary;
  let _textColor = textColor || colors.textReversed;
  if (disabled) {
    _backgroundColor = colorDisabled || colors.bgDisable;
    _textColor = textColorDisabled || colors.textDisabled;
  }

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      backgroundColor: _backgroundColor,
      padding: spacing?.padding.base,
      borderRadius: spacing?.borderRadius.small,
      alignItems: 'center',
    },
    style,
  ]);
  return (
    <ButtonWrapper
      disabled={disabled}
      style={containerStyle}
      textProps={{color: _textColor}}
      underlayColor={_colorHover}
      TouchableComponent={TouchableHighlight}
      {...props}>
      {children}
    </ButtonWrapper>
  );
};

export default ButtonPrimary;
