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
  const {colors, spacing}: ITheme = useTheme() as ITheme;

  const underlayColor = colors.placeholder;
  let backgroundColor = colors.primary1;
  let textColor = colors.error;

  if (disabled) {
    backgroundColor = colors.bgDisable;
    textColor = colors.textDisabled ? colors.textDisabled : '#BDBDBD';
  }

  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      backgroundColor: backgroundColor,
      padding: spacing?.padding.small,
      borderRadius: spacing?.borderRadius.small,
      alignItems: 'center',
    },
    style,
  ]);

  return (
    <ButtonWrapper
      disabled={disabled}
      style={containerStyle}
      textProps={{color: textColor, useI18n}}
      underlayColor={underlayColor}
      TouchableComponent={TouchableHighlight}
      {...props}>
      {children}
    </ButtonWrapper>
  );
};

export default ButtonDanger;
