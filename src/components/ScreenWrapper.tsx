import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
export interface Props {
  colorSecondary?: boolean;
  isFullView?: boolean;
  style?: any;
  disabledDarkMode?: boolean;
  [x: string]: any;
}

const ScreenWrapper: React.FC<Props> = ({
  colorSecondary,
  isFullView,
  style,
  disabledDarkMode,
  ...restProps
}) => {
  const theme: any = useTheme();

  return (
    <View
      {...restProps}
      style={StyleSheet.flatten([
        {
          backgroundColor: colorSecondary
            ? theme.colors.bgColorSecondary
            : theme.colors.bgColor,
        },
        isFullView && {flex: 1},
        style && style,
        disabledDarkMode && {backgroundColor: theme.colors.white},
      ])}
    />
  );
};

ScreenWrapper.defaultProps = {
  disabledDarkMode: false,
};

export default ScreenWrapper;
