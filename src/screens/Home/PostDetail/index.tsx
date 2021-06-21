import React from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import ContentItem from '~/theme/components/List/items/ContentItem';
import {post} from './dummy-post-data';

// TODO: need to use redux to get data
// Temp: using dummy data to show post detail
const PostDetailScreen = () => {
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;

  return (
    <Wrapper
      behavior="padding"
      keyboardVerticalOffset={20}
      style={styles.container}>
      <ContentItem {...post} maxLength={-1} showBackButton={true} />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PostDetailScreen;
