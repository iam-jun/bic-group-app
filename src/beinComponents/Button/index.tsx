import React from 'react';
import ButtonWrapper, {ButtonWrapperProps} from './ButtonWrapper';
import Primary from './ButtonPrimary';
import Secondary from './ButtonSecondary';
import BottomFixed from './ButtonBottomFixed';
import BottomSecondary from './ButtonBottomSecondary';
import {StyleProp, ViewStyle} from 'react-native';
import {TextProps, TextVariant} from '~/beinComponents/Text';

export interface ButtonProps extends ButtonWrapperProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  textVariant?: TextVariant;
  textProps?: TextProps;
}

const ButtonComponent: React.FC<ButtonProps> = (props: ButtonProps) => {
  return <ButtonWrapper {...props} />;
};

const Button = Object.assign(ButtonComponent, {
  Primary,
  Secondary,
  BottomFixed,
  BottomSecondary,
});

export default Button;
