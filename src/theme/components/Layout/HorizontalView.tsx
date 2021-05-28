import React from 'react';
import {View, StyleSheet} from 'react-native';

export interface Props {
  style?: any;
  children?: any;
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
