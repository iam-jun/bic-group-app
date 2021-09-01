import React from 'react';
import {StyleSheet, StyleProp, View, ViewStyle} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

export interface DividerProps {
  color?: string;
  size?: number;
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
  margin?: number;
}

const Divider: React.FC<DividerProps> = ({
  color,
  horizontal,
  size = 1,
  margin = 0,
  style = {},
}: DividerProps) => {
  const {colors}: ITheme = useTheme() as ITheme;
  return (
    <View
      style={StyleSheet.flatten([
        {
          height: horizontal ? undefined : size,
          width: horizontal ? size : undefined,
          [horizontal ? 'marginVertical' : 'marginHorizontal']: margin,
          alignSelf: 'stretch',
          backgroundColor: color || colors.borderDivider,
        },
        style,
      ])}
    />
  );
};

export default Divider;
