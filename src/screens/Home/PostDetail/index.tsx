import React from 'react';
import {StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import InputToolbar from '~/theme/components/Input/InputToolbar';
import ContentItem from '~/theme/components/List/items/ContentItem';
import ListView from '~/theme/components/List/ListView';
import {spacing} from '~/theme/configs';
import {post} from './dummy-post-data';
import * as actions from '~/store/comment/actions';
import {IObject} from '~/interfaces/common';
import {generateUniqueId} from '~/utils/generation';
import useAuth from '~/hooks/auth';

// TODO: need to use redux to get data
// Temp: using dummy data to show post detail
const PostDetailScreen = () => {
  const {user} = useAuth();

  const dispatch = useDispatch();
  const comments = useSelector((state: IObject<any>) => state.comment.comments);

  const onSendComment = (content: string) => {
    dispatch(
      actions.sendComment({
        id: generateUniqueId(),
        content,
        user,
        createdAt: '2021-06-27T11:14:44.579Z',
        updateAt: '2021-06-27T11:14:44.579Z',
        replyCount: 0,
      }),
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
      style={styles.container}>
      <ListView
        style={styles.comment}
        type="comment"
        data={comments.data}
        ListHeaderComponent={
          <ContentItem {...post} maxLength={-1} showBackButton={true} />
        }
      />
      <InputToolbar onSend={onSendComment} />
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
