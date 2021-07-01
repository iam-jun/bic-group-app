import React from 'react';

import {View} from 'react-native';

export interface Props {
  width?: number;
  height?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

const ViewSpacing: React.FC<Props> = ({
  width,
  height,
  paddingHorizontal,
  paddingVertical,
}) => {
  return (
    <View
      style={{
        width,
        height,
        paddingHorizontal,
        paddingVertical,
      }}
    />
  );
};

ViewSpacing.defaultProps = {
  width: undefined,
  height: undefined,
  paddingHorizontal: undefined,
  paddingVertical: undefined,
};

export default ViewSpacing;
