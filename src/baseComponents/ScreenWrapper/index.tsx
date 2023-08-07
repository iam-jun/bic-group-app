import React from 'react';
import {
  StyleProp, View, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { Freeze } from 'react-freeze';

export interface ScreenWrapperProps extends ViewStyle {
  backgroundColor?: string;
  isFullView?: boolean;
  style?: StyleProp<ViewStyle>;
  shouldSuspendRendering?: boolean;
  [x: string]: any;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  backgroundColor,
  isFullView = false,
  style,
  shouldSuspendRendering = false,
  ...props
}: ScreenWrapperProps) => {
  const theme: ExtendedTheme = useTheme();

  return (
    <Freeze freeze={shouldSuspendRendering}>
      <View
        {...props}
        style={[{ backgroundColor: backgroundColor || theme.colors.white }, isFullView && { flex: 1 }, style && style]}
      />
    </Freeze>
  );
};

export default ScreenWrapper;
