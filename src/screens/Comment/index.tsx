import React, {useState} from 'react';
import {StyleSheet, TextInput, ScrollView} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {useDispatch, useSelector} from 'react-redux';

import CommentItem from '~/theme/components/List/items/CommentItem';
import Text from '~/theme/components/Text';
import {useBaseHook} from '~/hooks';
import {ThemeView} from '~/theme/components';
import InputToolbar from '~/theme/components/Input/InputToolbar';
import Header from '~/theme/components/Header';
import MessageOptionsModal from '~/theme/containers/Modal/MessageOptions';
import {IObject} from '~/interfaces/common';
import {generateUniqueId} from '~/utils/generation';
import useAuth from '~/hooks/auth';
import commonActions from '~/constants/commonActions';
import CRUDListView from '~/theme/components/List/CRUDListView';
import listActions from '~/store/CRUDList/actions';

const CommentScreen = ({route}: {route: any}) => {
  const dispatch = useDispatch();
  const comments = useSelector((state: IObject<any>) => state.comment.comments);
  const originalComment = {...comments.data[0], showReplies: true};

  const {t} = useBaseHook();
  const commentInputRef = React.useRef<TextInput>(null);
  const commentOptionsModalRef = React.useRef<Modalize>();
  const {commentFocus} = route.params || false;
  const {user} = useAuth();

  const [replyingComment, setReplyingComment] = useState('');

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
    dispatch(
      listActions.createItem('replies', {
        id: generateUniqueId(),
        content,
        user,
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
      }),
    );
  };

  const loadMoreReplies = () => {
    dispatch(listActions.mergeExtraData('replies', 'comment'));
  };

  return (
    <ThemeView isFullView testID="CommentScreen">
      <Header
        isFullView
        isDefault
        title={`Reply to ${originalComment.user.name}`}
        rightIcon="iconOptions"
      />
      <ScrollView>
        <CRUDListView
          listType="comment"
          dataType="replies"
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
        modalRef={commentOptionsModalRef}
        onReactionPress={onReactionPress}
      />

      <InputToolbar
        onActionPress={_onActionPress}
        inputRef={commentInputRef}
        commentFocus={commentFocus}
        onSend={onSendReply}
        replyingComment={replyingComment}
      />
    </ThemeView>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  viewMore: {
    marginStart: 56,
    marginVertical: 12,
  },
});
