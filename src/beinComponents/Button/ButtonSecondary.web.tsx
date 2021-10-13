import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import Div from '../Div';
import {ButtonSecondaryProps} from './ButtonSecondary';
import ButtonWrapper from './ButtonWrapper';

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  color,
  colorHover,
  colorDisabled,
  textColor,
  textColorDisabled,
  useI18n,
  children,
  style,
  disabled,
  highEmphasis = false,
  ...props
}: ButtonSecondaryProps) => {
  const {colors, spacing}: ITheme = useTheme() as ITheme;
  let className = 'button--secondary';

  const _colorHover = colorHover || colors.primary2;
  let _textColor = textColor || colors.primary;

  if (highEmphasis) {
    _textColor = colors.background;
    className = className + ' button--secondary--high-emphasis';
  }

  if (disabled) {
    // @ts-ignore
    _textColor = textColorDisabled || colors.textDisabled;
    className = 'button--disable';
  }

  return (
    <Div style={style}>
      <Div
        className={className}
        style={{backgroundColor: disabled ? colorDisabled : color}}>
        <ButtonWrapper
          disabled={disabled}
          textProps={{color: _textColor, useI18n}}
          underlayColor={_colorHover}
          TouchableComponent={TouchableWithoutFeedback}
          contentStyle={{padding: spacing.padding.small}}
          {...props}>
          {children}
        </ButtonWrapper>
      </Div>
    </Div>
  );
};

export default ButtonSecondary;
