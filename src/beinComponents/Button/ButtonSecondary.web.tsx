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
  borderRadius,
  contentStyle,
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

  const _borderRadiusStyle = !!borderRadius ? {borderRadius} : {};
  //style: margin button
  //contentStyle: style button
  return (
    <Div style={style}>
      <Div className={className}>
        <ButtonWrapper
          disabled={disabled}
          underlayColor={_colorHover}
          TouchableComponent={TouchableWithoutFeedback}
          contentStyle={[
            {
              backgroundColor: disabled ? colorDisabled : color,
              padding: spacing.padding.small,
            },
            contentStyle,
            _borderRadiusStyle,
          ]}
          {...props}
          textProps={{color: _textColor, useI18n, ...props?.textProps}}>
          {children}
        </ButtonWrapper>
      </Div>
    </Div>
  );
};

export default ButtonSecondary;
