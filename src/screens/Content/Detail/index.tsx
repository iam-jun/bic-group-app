import React from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import ContentItem from '~/theme/components/List/items/ContentItem';
import {useSelector} from 'react-redux';

const PostDetailScreen = () => {
  const Wrapper = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const {postDetail} = useSelector(state => state);
  const {post} = postDetail;

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
