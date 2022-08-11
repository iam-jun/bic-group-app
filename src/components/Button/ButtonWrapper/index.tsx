import React from 'react';
import {
  TouchableHighlightProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { useKeySelector } from '~/hooks/selector';

export interface ButtonWrapperProps extends TouchableOpacityProps, TouchableHighlightProps {
  nativeID?: string;
  TouchableComponent?: any;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  disabled,
  TouchableComponent = TouchableOpacity,
  ...props
}: ButtonWrapperProps) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  return (
    <TouchableComponent
      disabled={!isInternetReachable || disabled}
      {...props}
    />
  );
};

export default ButtonWrapper;
