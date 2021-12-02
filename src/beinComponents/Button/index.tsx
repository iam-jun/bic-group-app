import React from 'react';
import ButtonWrapper, {ButtonWrapperProps} from './ButtonWrapper';
import Primary from './ButtonPrimary';
import Secondary from './ButtonSecondary';
import Danger from './ButtonDanger';
import BottomFixed from './ButtonBottomFixed';
import BottomSecondary from './ButtonBottomSecondary';
import Icon from './ButtonIcon';
import {StyleProp, ViewStyle} from 'react-native';
import {TextProps, TextVariant} from '~/beinComponents/Text';
import {useKeySelector} from '~/hooks/selector';

export interface ButtonProps extends ButtonWrapperProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: (e: any) => void;
  onLongPress?: (e: any) => void;
  textVariant?: TextVariant;
  textProps?: TextProps;
}

const ButtonComponent: React.FC<ButtonProps> = (props: ButtonProps) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  return <ButtonWrapper {...props} disabled={!isInternetReachable === false} />;
};

const Button = Object.assign(ButtonComponent, {
  Primary,
  Secondary,
  Danger,
  BottomFixed,
  BottomSecondary,
  Icon,
});

export default Button;
