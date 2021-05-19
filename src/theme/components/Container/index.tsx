import React from 'react';
import {StyleSheet, View, ViewStyle, StyleProp} from 'react-native';

import {padding} from '~/theme/configs/spacing';

export interface Props {
  fluid?: boolean;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  [x: string]: any;
}

const Container: React.FC<Props> = ({fluid, style, children, ...rest}) => {
  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
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
  container: {
    paddingHorizontal: padding.large,
  },
  fluid: {
    paddingHorizontal: 0,
  },
};

export default Container;
