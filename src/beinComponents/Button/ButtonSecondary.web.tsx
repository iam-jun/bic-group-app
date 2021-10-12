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
  const {onPress, onLongPress} = props;
  const {colors}: ITheme = useTheme() as ITheme;
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

  /*
  Wrap the inside div in buttonWrapper again
  to make sure onPress, and onLongPress work
  even when clicking on the edge
  */
  return (
    <Div style={style}>
      <ButtonWrapper
        onPress={onPress}
        onLongPress={onLongPress}
        TouchableComponent={TouchableWithoutFeedback}>
        <Div
          className={className}
          style={{backgroundColor: disabled ? colorDisabled : color}}>
          <ButtonWrapper
            disabled={disabled}
            textProps={{color: _textColor, useI18n}}
            underlayColor={_colorHover}
            TouchableComponent={TouchableWithoutFeedback}
            {...props}>
            {children}
          </ButtonWrapper>
        </Div>
      </ButtonWrapper>
    </Div>
  );
};

export default ButtonSecondary;
