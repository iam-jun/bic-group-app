import React from 'react';
import {StyleSheet, View, ViewStyle, StyleProp} from 'react-native';

import {padding} from '~/theme/spacing';

export interface Props {
  isFullView?: boolean;
  fluid?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  [x: string]: any;
}

const Container: React.FC<Props> = ({
  isFullView,
  fluid,
  style,
  children,
  ...rest
}) => {
  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        isFullView && styles.fullView,
        fluid && styles.fluid,
        style,
      ])}
      {...rest}>
      {children}
    </View>
  );
};

Container.defaultProps = {
  fluid: false,
};

const styles = {
  fullView: {
    flex: 1,
  },
  container: {
    padding: padding.base,
  },
  fluid: {
    paddingHorizontal: 0,
  },
};

export default Container;
