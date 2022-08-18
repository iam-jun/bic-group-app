import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, ScrollView } from 'react-native';
import { light } from '~/theme/theme';

export default function StoryWrapper({ children }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.main}>{children}</View>
    </ScrollView>
  );
}

StoryWrapper.defaultProps = {
  children: null,
};

StoryWrapper.propTypes = {
  children: PropTypes.node,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: light.colors.neutral,
  },
  main: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
})
