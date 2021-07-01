import React from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';

export interface Props {
  style?: StyleProp<{}>;
  children?: React.ReactNode;
}

const HorizontalView: React.FC<Props> = ({style, children, ...props}) => (
  <View {...props} style={StyleSheet.compose(styles.container, style)}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default HorizontalView;
