import React from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

export interface ScreenWrapperProps extends ViewStyle {
  backgroundColor?: string;
  isFullView?: boolean;
  style?: StyleProp<ViewStyle>;
  [x: string]: any;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  backgroundColor,
  isFullView = false,
  style,
  ...props
}: ScreenWrapperProps) => {
  const theme: ExtendedTheme = useTheme();

  return (
    <View
      {...props}
      style={[
        { backgroundColor: backgroundColor || theme.colors.white },
        isFullView && { flex: 1 },
        style && style,
      ]}
    />
  );
};

export default ScreenWrapper;
