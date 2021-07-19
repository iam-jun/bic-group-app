import React, {useState} from 'react';
import {StyleSheet, TextInput, ScrollView} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {useDispatch} from 'react-redux';

import CommentItem from '~/components/list/items/CommentItem';
import ListView from '~/components/list/ListView';
import Text from '~/components/texts/Text';
import {useBaseHook} from '~/hooks';
import {ScreenWrapper} from '~/components';
import InputToolbar from '~/components/inputs/InputToolbar';
import NavigationHeader from '~/components/headers/NavigationHeader';
import MessageOptionsModal from '../fragments/OptionsModal';
import useAuth from '~/hooks/auth';
import commonActions from '~/constants/commonActions';
import IComment from '~/interfaces/IComment';
import useComment from '~/hooks/comment';

const CommentScreen = ({route}: {route: any}) => {
  const dispatch = useDispatch();
  const {comments} = useComment();
  const originalComment = {...comments.data[0]};

  const {t} = useBaseHook();
  const commentInputRef = React.useRef<TextInput>(null);
  const commentOptionsModalRef = React.useRef<Modalize>();
  const {commentFocus} = route.params || false;
  const {user} = useAuth();

  const [replyingComment, setReplyingComment] =
    useState<IComment>(originalComment);

  const onReactionPress = async (type: string) => {
    console.log('Reacted!');
    commentOptionsModalRef.current?.close();
  };

  const _onActionPress = (action: string, item?: any) => {
    switch (action) {
      case commonActions.replyComment:
        setReplyingComment(item);
        commentInputRef.current?.focus();
        break;

      case commonActions.emojiCommentReact:
        return commentOptionsModalRef.current?.open();
    }
  };

  const onSendReply = (content: string) => {
    // dispatch(
    //   listActions.createItem('replies', {
    //     id: generateUniqueId(),
    //     content,
    //     user,
    //     createdAt: new Date().toISOString(),
    //     updateAt: new Date().toISOString(),
    //   }),
    // );
  };

  const loadMoreReplies = () => {
    // dispatch(listActions.mergeExtraData('replies', 'comment'));
  };

  return (
    <ScreenWrapper isFullView testID="CommentScreen">
      <NavigationHeader
        isFullView
        isDefault
        title={`Reply to ${originalComment?.user?.name}`}
        rightIcon="iconOptions"
      />
      <ScrollView>
        <ListView
          type="comment"
          onActionPress={_onActionPress}
          inverted={true}
          ListFooterComponent={
            <>
              <CommentItem
                {...originalComment}
                onActionPress={_onActionPress}
                loadMoreReplies={loadMoreReplies}
              />
              <Text style={styles.viewMore} onPress={loadMoreReplies}>
                {t('comment:view_previous_comments')}
              </Text>
            </>
          }
        />
      </ScrollView>

      <MessageOptionsModal
        ref={commentOptionsModalRef}
        onReactionPress={onReactionPress}
      />

      <InputToolbar
        onActionPress={_onActionPress}
        inputRef={commentInputRef}
        commentFocus={commentFocus}
        onSend={onSendReply}
        replyingComment={replyingComment}
        setReplyingComment={setReplyingComment}
      />
    </ScreenWrapper>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  viewMore: {
    marginStart: 56,
    marginVertical: 12,
  },
});
