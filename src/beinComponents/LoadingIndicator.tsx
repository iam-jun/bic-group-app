import React from 'react';
import {ActivityIndicator, StyleProp, ViewStyle} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';

export interface LoadingIndicatorProps {
  style?: StyleProp<ViewStyle>;
  size?: number | 'small' | 'large';
  color?: 'string';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  style,
  size,
  color,
}: LoadingIndicatorProps) => {
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;

  return (
    <ActivityIndicator
      style={style}
      size={size}
      color={color || colors.borderDisable}
    />
  );
};

export default LoadingIndicator;
