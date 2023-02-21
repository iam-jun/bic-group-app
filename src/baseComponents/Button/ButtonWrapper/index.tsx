import React from 'react';
import {
  TouchableHighlightProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';

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
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);

  return (
    <TouchableComponent
      testID={testID || 'button_wrapper'}
      disabled={!isInternetReachable || disabled}
      {...props}
    />
  );
};

export default ButtonWrapper;
