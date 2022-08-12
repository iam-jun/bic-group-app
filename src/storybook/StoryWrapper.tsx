import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

export default function StoryWrapper({ children }) {
  return <View style={styles.main}>{children}</View>;
}

StoryWrapper.defaultProps = {
  children: null,
};

StoryWrapper.propTypes = {
  children: PropTypes.node,
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
})
