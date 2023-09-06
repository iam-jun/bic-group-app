import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import CommentPlaceholder from './CommentPlaceholder';
import spacing from '~/theme/spacing';

const CommentViewPlaceholder = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);

  return (
    <View style={styles.container} testID="comment_view_placeholder">
      <CommentPlaceholder />
      <CommentPlaceholder isChildComment />
      <CommentPlaceholder isChildComment />
    </View>
  );
};

const createStyle = (_theme: ExtendedTheme) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.padding.large,
  },
});

export default CommentViewPlaceholder;
