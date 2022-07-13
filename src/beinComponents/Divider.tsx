import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ExtendedTheme, useTheme} from '@react-navigation/native';
export interface DividerProps {
  testID?: string;
  color?: string;
  size?: number;
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
  margin?: number;
}

const Divider: React.FC<DividerProps> = ({
  testID,
  color,
  horizontal,
  size = 1,
  margin = 0,
  style = {},
}: DividerProps) => {
  const {colors}: ExtendedTheme = useTheme() as ExtendedTheme;
  return (
    <View
      testID={testID || 'divider'}
      style={[
        {
          height: horizontal ? undefined : size,
          width: horizontal ? size : undefined,
          [horizontal ? 'marginVertical' : 'marginHorizontal']: margin,
          alignSelf: 'stretch',
          backgroundColor: color || colors.neutral5,
        },
        style,
      ]}
    />
  );
};

export default Divider;
