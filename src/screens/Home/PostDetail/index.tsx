import React from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {ThemeView} from '~/theme/components';
import ContentItem from '~/theme/components/List/items/ContentItem';
import ListView from '~/theme/components/List/ListView';
import {spacing} from '~/theme/configs';
import {commentData} from './dummy-comment-data';
import {post} from './dummy-post-data';

// TODO: need to use redux to get data
// Temp: using dummy data to show post detail
const PostDetailScreen = () => {
  return (
    <ThemeView isFullView>
      <ListView
        contentContainerStyle={styles.comment}
        type="comment"
        data={commentData}
        ListHeaderComponent={
          <ContentItem {...post} maxLength={-1} showBackButton={true} />
        }
      />
    </ThemeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  comment: {
    paddingTop: spacing.padding.base,
  },
});

export default PostDetailScreen;
