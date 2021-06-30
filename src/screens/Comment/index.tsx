import React, {useState} from 'react';
import {StyleSheet, TextInput, ScrollView} from 'react-native';
import {Modalize} from 'react-native-modalize';

import CommentItem from '~/theme/components/List/items/CommentItem';
import Text from '~/theme/components/Text';
import {margin, padding} from '~/theme/configs/spacing';
import {dummyReplies} from '../Home/PostDetail/dummy-replies';
import ListView from '~/theme/components/List/ListView';
import {useBaseHook} from '~/hooks';
import {ThemeView} from '~/theme/components';
import InputToolbar from '~/theme/components/Input/InputToolbar';
import Header from '~/theme/components/Header';
import MessageOptionsModal from '~/theme/containers/Modal/MessageOptions';
import {useDispatch, useSelector} from 'react-redux';
import {IObject} from '~/interfaces/common';
import * as actions from '~/store/comment/actions';
import {generateUniqueId} from '~/utils/generation';
import useAuth from '~/hooks/auth';
import commonActions from '~/constants/commonActions';

const CommentScreen = ({route}: {route: any}) => {
  const dispatch = useDispatch();
  const comments = useSelector((state: IObject<any>) => state.comment.comments);
  const originalComment = {...comments.data[0], showReplies: true};

  const {t, navigation} = useBaseHook();
  const commentInputRef = React.useRef<TextInput>(null);
  const commentOptionsModalRef = React.useRef<Modalize>();
  const {commentFocus} = route.params || false;
  const {user} = useAuth();

  const onReactionPress = async (type: string) => {
    console.log('Reacted!');
    commentOptionsModalRef.current?.close();
  };

  const _onActionPress = (action: string) => {
    switch (action) {
      case commonActions.replyComment:
        return commentInputRef.current?.focus();

      case commonActions.emojiCommentReact:
        return commentOptionsModalRef.current?.open();
    }
  };

  const onSendComment = (content: string) => {};

  return (
    <ThemeView isFullView testID="CommentScreen">
      <Header
        isFullView
        isDefault
        title={`Reply to ${originalComment.user.fullName}`}
        rightIcon="iconOptions"
      />
      <ScrollView>
        <CommentItem {...originalComment} onActionPress={_onActionPress} />
      </ScrollView>

      <MessageOptionsModal
        modalRef={commentOptionsModalRef}
        onReactionPress={onReactionPress}
      />

      <InputToolbar
        onActionPress={_onActionPress}
        inputRef={commentInputRef}
        commentFocus={commentFocus}
        onSend={onSendComment}
      />
    </ThemeView>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({});
