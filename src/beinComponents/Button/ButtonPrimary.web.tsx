import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useTheme} from 'react-native-paper';

import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import {ITheme} from '~/theme/interfaces';
import Div from '../Div';
import {ButtonPrimaryProps} from './ButtonPrimary';

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  color,
  colorHover,
  colorDisabled,
  textColor,
  textColorDisabled,
  useI18n,
  children,
  style,
  disabled,
  ...props
}: ButtonPrimaryProps) => {
  const {onPress, onLongPress} = props;
  const {colors}: ITheme = useTheme() as ITheme;
  let className = 'button--primary';

  const _colorHover = colorHover || colors.iconTint;
  let _textColor = textColor || colors.textReversed;

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

export default ButtonPrimary;
