import React from 'react';
import {StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';

import InputToolbar from '~/theme/components/Input/InputToolbar';
import ContentItem from '~/theme/components/List/items/ContentItem';
import ListView from '~/theme/components/List/ListView';
import {spacing} from '~/theme/configs';
import {commentData} from './dummy-comment-data';
import {post} from './dummy-post-data';

// TODO: need to use redux to get data
// Temp: using dummy data to show post detail
const PostDetailScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
      style={styles.container}>
      <ListView
        style={styles.comment}
        type="comment"
        data={commentData}
        ListHeaderComponent={
          <ContentItem {...post} maxLength={-1} showBackButton={true} />
        }
      />
      <InputToolbar />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  comment: {
    paddingTop: spacing.padding.base,
    marginBottom: 60,
  },
});

export default PostDetailScreen;
