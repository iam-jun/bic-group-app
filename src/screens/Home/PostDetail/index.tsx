import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Text from '~/theme/components/Text';
import InputToolbar from '~/theme/components/Input/InputToolbar';
import ContentItem from '~/theme/components/List/items/ContentItem';
import ListView from '~/theme/components/List/ListView';
import {spacing} from '~/theme/configs';
import {post} from './dummy-post-data';
import * as actions from '~/store/comment/actions';
import {IObject} from '~/interfaces/common';
import {generateUniqueId} from '~/utils/generation';
import useAuth from '~/hooks/auth';
import {ReactionAction} from '..';
import {margin} from '~/theme/configs/spacing';
import {useBaseHook} from '~/hooks';

// TODO: need to use redux to get data
// Temp: using dummy data to show post detail
const PostDetailScreen = ({route}: {route: any}) => {
  const {t} = useBaseHook();
  const {commentFocus} = route.params || false;
  const commentInputRef = React.useRef<TextInput>(null);

  const {user} = useAuth();

  const dispatch = useDispatch();
  const comments = useSelector((state: IObject<any>) => state.comment.comments);

  const _onActionPress = (action: ReactionAction) => {
    switch (action) {
      case 'reaction-comment':
        return commentInputRef.current?.focus();
    }
  };

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
          <>
            <ContentItem
              {...post}
              onActionPress={_onActionPress}
              maxLength={-1}
              showBackButton={true}
            />
            <Text
              bold
              style={styles.prevComments}
              onPress={() => console.log('Load previous comments...')}>
              {t('post:view_previous_comments')}
            </Text>
          </>
        }
      />
      <InputToolbar
        inputRef={commentInputRef}
        commentFocus={commentFocus}
        onSend={onSendComment}
      />
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
  prevComments: {
    margin: margin.large,
  },
});

export default PostDetailScreen;
