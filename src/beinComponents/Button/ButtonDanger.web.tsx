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
          TouchableComponent={TouchableWithoutFeedback}
          style={style}
          contentStyle={[
            {
              paddingVertical: spacing.padding.small,
              paddingHorizontal: spacing.padding.base,
            },
            style,
          ]}
          {...props}
          textProps={{color: 'inherit', useI18n, ...props?.textProps}}>
          {children}
        </ButtonWrapper>
      </Div>
    </Div>
  );
};

export default ButtonPrimary;
