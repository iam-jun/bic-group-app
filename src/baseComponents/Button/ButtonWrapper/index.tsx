import React from 'react';
import {
  TouchableHighlightProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { useKeySelector } from '~/hooks/selector';

export interface ButtonWrapperProps extends TouchableOpacityProps, TouchableHighlightProps {
  nativeID?: string;
  testID?: string;
  TouchableComponent?: any;
}

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  testID,
  disabled,
  TouchableComponent = TouchableOpacity,
  ...props
}: ButtonWrapperProps) => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  return (
    <TouchableComponent
      testID={testID || 'button_wrapper'}
      disabled={!isInternetReachable || disabled}
      {...props}
    />
  );
};

export default ButtonWrapper;
