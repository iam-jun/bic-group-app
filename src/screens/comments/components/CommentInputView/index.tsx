import React, { FC, useEffect, useRef } from 'react';
import { View } from 'react-native';
import uuid from 'react-native-uuid';

import CommentInput, {
  ICommentInputSendParam,
} from '~/beinComponents/inputs/CommentInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import { useBaseHook } from '~/hooks';
import { useUserIdAuth } from '~/hooks/auth';
import {
  IActivityDataImage,
  ICommentData,
  IPayloadCreateComment,
  IPayloadReplying,
  IPostMedia,
} from '~/interfaces/IPost';
import useCommonController from '~/screens/store';
import ReplyingView from './ReplyingView';
import useCommentInputStore from './store';
import ICommentInputState from './store/Interface';
import usePostsStore from '~/store/entities/posts';

export interface CommentInputViewProps {
  postId: string;
  groupIds: string;
  autoFocus?: boolean;
  commentInputRef?: any;
  showHeader?: boolean;
  defaultReplyTargetId?: string;
  viewMore?: boolean;
  onCommentSuccess?: () => void;
}

const CommentInputView: FC<CommentInputViewProps> = ({
  postId,
  groupIds = '',
  autoFocus,
  commentInputRef,
  showHeader,
  defaultReplyTargetId,
  onCommentSuccess,
  viewMore,
}: CommentInputViewProps) => {
  const _commentInputRef = commentInputRef || useRef<any>();
  const mentionInputRef = useRef<any>();

  const { t } = useBaseHook();

  const postActions = usePostsStore((state) => state.actions);
  const actions = useCommentInputStore((state: ICommentInputState) => state.actions);
  const createComment = useCommentInputStore((state: ICommentInputState) => state.createComment);
  const { content = '', loading } = createComment || {};

  const userId = useUserIdAuth();
  const myProfile = useCommonController((state) => state.myProfile);
  const { fullname, avatar, username } = myProfile;

  const replying: IPayloadReplying = usePostsStore((state) => state.replyingComment);
  const replyTargetId = replying?.parentComment?.id || replying?.comment?.id;
  const replyTargetUser = replying?.comment?.actor || replying?.parentComment?.actor;
  const replyTargetUserId = replyTargetUser?.id;
  let replyTargetName = replyTargetUser?.fullname;
  if (replyTargetUserId === userId) {
    replyTargetName = t('post:label_yourself');
  }

  useEffect(
    () => () => {
      actions.setCreateComment({ content: '', loading: false });
      postActions.setPostDetailReplyingComment();
    },
    [],
  );

  useEffect(
    () => {
      if (replyTargetUserId && replyTargetUser?.username) {
        let content = `@${replyTargetUser?.username} `;
        if (replyTargetUserId === userId) {
          content = '';
        }
        mentionInputRef?.current?.setContent(content);
      }
    }, [replyTargetName, replyTargetUserId],
  );

  useEffect(
    () => {
      if (!content) {
        _commentInputRef?.current?.clear?.();
        mentionInputRef?.current?.setContent?.('');
      }
    }, [content],
  );

  const _onCommentSuccess = () => {
    _commentInputRef?.current?.clear?.();
    mentionInputRef?.current?.setContent?.('');
    onCommentSuccess && onCommentSuccess();
  };

  const onPressSend = (sendData?: ICommentInputSendParam) => {
    if (postId && !loading) {
      const images: IActivityDataImage[] = [];
      if (sendData?.image) {
        images.push(sendData?.image);
      }

      const media: IPostMedia = {
        images,
      };

      const preComment: ICommentData = {
        status: 'pending',
        localId: uuid.v4(), // localId is used for finding and updating comment data from API later
        actor: {
          id: userId,
          username,
          fullname,
          avatar,
        },
        content: content?.trim(),
        media: { images },
        postId,
        reactionsCount: [],
        ownerReactions: {},
        child: {},
        createdAt: new Date().toISOString(),
        parentCommentId: replyTargetId || defaultReplyTargetId,
      };

      const payload: IPayloadCreateComment = {
        postId,
        parentCommentId: replyTargetId || defaultReplyTargetId,
        commentData: { content: content?.trim(), media, giphy: sendData?.giphy },
        userId,
        onSuccess: _onCommentSuccess,
        viewMore,
        preComment,
      };

      actions.createComment(payload);
    }
  };

  const onChangeText = (value: string) => {
    _commentInputRef.current.setText(value);
    actions.setCreateComment({ content: value });
  };

  return (
    <View>
      <MentionInput
        disableAutoComplete
        groupIds={groupIds}
        ComponentInput={CommentInput}
        mentionInputRef={mentionInputRef}
        componentInputProps={{
          commentInputRef: _commentInputRef,
          value: content,
          autoFocus,
          HeaderComponent: (!!showHeader && <ReplyingView />) || null,
          loading,
          isHandleUpload: true,
          placeholder: t('post:placeholder_write_comment'),
          onChangeText,
          onPressSend,
        }}
      />
    </View>
  );
};

export default CommentInputView;
