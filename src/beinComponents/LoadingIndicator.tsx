import React from 'react';
import {ActivityIndicator, StyleProp, ViewStyle} from 'react-native';

import {ExtendedTheme, useTheme} from '@react-navigation/native';

export interface LoadingIndicatorProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  size?: number | 'small' | 'large';
  color?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  testID,
  style,
  size,
  color,
}: LoadingIndicatorProps) => {
  const theme: ExtendedTheme = useTheme() as ExtendedTheme;
  const {colors} = theme;

  return (
    <ActivityIndicator
      testID={testID || 'loading_indicator'}
      style={style}
      size={size}
      color={color || colors.gray40}
    />
  );
};

export default LoadingIndicator;
