import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {ActivityIndicator, useTheme} from 'react-native-paper';

export interface LoadingProps {
  style?: StyleProp<ViewStyle>;
  size?: number | 'small' | 'large';
  color?: 'string';
}

const Loading: React.FC<LoadingProps> = ({
  style,
  size,
  color,
}: LoadingProps) => {
  const theme: ITheme = useTheme();
  const {colors} = theme;

  return (
    <ActivityIndicator
      style={style}
      size={size}
      color={color || colors.borderDisable}
    />
  );
};

export default Loading;
