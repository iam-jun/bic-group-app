import React from 'react';
import ButtonWrapper from './ButtonWrapper';
import Primary from './ButtonPrimary';
import {StyleProp, ViewStyle} from 'react-native';
import {TextProps, TextVariant} from '~/beinComponents/Text';

export interface ButtonProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  textVariant?: TextVariant;
  textProps?: TextProps;
}

const _Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  return <ButtonWrapper {...props} />;
};

const Button = Object.assign(_Button, {Primary});

export default Button;
