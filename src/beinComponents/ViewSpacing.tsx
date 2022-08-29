import React from 'react';

import { View } from 'react-native';

export interface ViewSpacingProps {
  width?: number;
  height?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

const ViewSpacing: React.FC<ViewSpacingProps> = ({
  width,
  height,
  paddingHorizontal,
  paddingVertical,
}: ViewSpacingProps) => (
  <View
    style={{
      width,
      height,
      paddingHorizontal,
      paddingVertical,
    }}
  />
);

export default ViewSpacing;
