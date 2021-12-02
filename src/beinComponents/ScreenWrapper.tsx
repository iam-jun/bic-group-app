import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
export interface ScreenWrapperProps extends ViewStyle {
  backgroundColor?: string;
  isFullView?: boolean;
  style?: StyleProp<ViewStyle>;
  [x: string]: any;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  backgroundColor,
  isFullView = false,
  style,
  ...props
}: ScreenWrapperProps) => {
  const theme = useTheme() as ITheme;

  return (
    <View
      {...props}
      style={StyleSheet.flatten([
        {backgroundColor: backgroundColor || theme.colors.background},
        isFullView && {flex: 1},
        style && style,
      ])}
    />
  );
};

export default ScreenWrapper;
