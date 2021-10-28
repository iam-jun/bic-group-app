import React from 'react';
import {TouchableWithoutFeedback} from 'react-native';
import {useTheme} from 'react-native-paper';

import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import {ITheme} from '~/theme/interfaces';
import Div from '../Div';
import {ButtonDangerProps} from './ButtonDanger';

const ButtonPrimary: React.FC<ButtonDangerProps> = ({
  useI18n,
  children,
  style,
  disabled,
  ...props
}: ButtonDangerProps) => {
  const {spacing}: ITheme = useTheme() as ITheme;
  const className = disabled ? 'button--disable' : 'button--danger';

  return (
    <Div style={style}>
      <Div className={className}>
        <ButtonWrapper
          disabled={disabled}
          textProps={{color: 'inherit', useI18n}}
          TouchableComponent={TouchableWithoutFeedback}
          contentStyle={{
            paddingVertical: spacing.padding.small,
            paddingHorizontal: spacing.padding.base,
          }}
          {...props}>
          {children}
        </ButtonWrapper>
      </Div>
    </Div>
  );
};

export default ButtonPrimary;
