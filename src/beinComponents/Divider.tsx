import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

export interface DividerProps {
  color?: string;
  size?: number;
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Divider = ({color, horizontal = false, size = 1, style = {}}: any) => {
  const {colors}: ITheme = useTheme();
  return (
    <View
      style={{
        height: horizontal ? undefined : size,
        width: horizontal ? size : undefined,
        alignSelf: 'stretch',
        backgroundColor: color || colors.borderDivider,
        ...style,
      }}
    />
  );
};

export default Divider;
