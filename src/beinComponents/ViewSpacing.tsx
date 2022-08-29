import React from 'react';

import { StyleProp, View, ViewStyle } from 'react-native';

export interface ViewSpacingProps {
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

const ViewSpacing: React.FC<ViewSpacingProps> = ({
  style,
  width,
  height,
  paddingHorizontal,
  paddingVertical,
}: ViewSpacingProps) => (
  <View
    style={[{
      width,
      height,
      paddingHorizontal,
      paddingVertical,
    }, style]}
  />
);

export default ViewSpacing;
