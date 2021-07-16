import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {ITheme} from '~/theme/interfaces';
export interface Props {
  isFullView?: boolean;
  style?: StyleProp<ViewStyle>;
  [x: string]: any;
}

const ScreenWrapper: React.FC<Props> = ({
  isFullView,
  style,
  ...restProps
}) => {
  const theme: ITheme = useTheme();

  return (
    <View
      {...restProps}
      style={StyleSheet.flatten([
        {backgroundColor: theme.colors.background},
        isFullView && {flex: 1},
        style && style,
      ])}
    />
  );
};

ScreenWrapper.defaultProps = {
};

export default ScreenWrapper;
