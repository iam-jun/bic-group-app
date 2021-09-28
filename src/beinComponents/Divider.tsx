import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';

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
      style={[
        {
          height: horizontal ? undefined : size,
          width: horizontal ? size : undefined,
          [horizontal ? 'marginVertical' : 'marginHorizontal']: margin,
          alignSelf: 'stretch',
          backgroundColor: color || colors.borderDivider,
        },
        style,
      ]}
    />
  );
};

export default Divider;
