import React, {FC, useEffect, useRef} from 'react';
import {Platform, View} from 'react-native';
import uuid from 'react-native-uuid';
import {useDispatch} from 'react-redux';
import CommentInput, {
  ICommentInputSendParam,
} from '~/beinComponents/inputs/CommentInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {useKeySelector} from '~/hooks/selector';
import {
  IActivityDataImage,
  IPayloadCreateComment,
  IPayloadReplying,
} from '~/interfaces/IPost';
import menuKeySelector from '~/screens/Menu/redux/keySelector';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';
import ReplyingView from './ReplyingView';

export interface CommentInputViewProps {
  postId: string;
  groupIds: string;
  autoFocus?: boolean;
  commentInputRef?: any;
  onCommentSuccess?: () => void;
  isCommentLevel1Screen?: boolean;
  showHeader?: boolean;
  defaultReplyTargetId?: number;
}

const CommentInputView: FC<CommentInputViewProps> = ({
  postId,
  groupIds = '',
  autoFocus,
  commentInputRef,
  isCommentLevel1Screen,
  showHeader,
  defaultReplyTargetId,
  onCommentSuccess,
}: CommentInputViewProps) => {
  const _commentInputRef = commentInputRef || useRef<any>();
  const mentionInputRef = useRef<any>();

  const dispatch = useDispatch();
  const {t} = useBaseHook();

  const userId = useUserIdAuth();
  const myProfile = useKeySelector(menuKeySelector.myProfile);
  const {fullname, avatar, username} = myProfile;

  const replying: IPayloadReplying = useKeySelector(
    postKeySelector.replyingComment,
  );
  const replyTargetId = replying?.parentComment?.id || replying?.comment?.id;
  const replyTargetUser =
    replying?.comment?.user || replying?.parentComment?.user;
  const replyTargetUserId = replyTargetUser?.id;
  let replyTargetName = replyTargetUser?.data?.fullname;
  if (replyTargetUserId === userId) {
    replyTargetName = t('post:label_yourself');
  }

  const content = useKeySelector(postKeySelector.createComment.content) || '';
  const loading = useKeySelector(postKeySelector.createComment.loading);

  useEffect(() => {
    dispatch(postActions.setPostDetailReplyingComment());
    return () => {
      dispatch(postActions.setCreateComment({content: '', loading: false}));
      dispatch(postActions.setPostDetailReplyingComment());
    };
  }, []);

  useEffect(() => {
    //clean data when post id change, in case sometime cache data on web
    dispatch(postActions.setCreateComment({content: '', loading: false}));
    dispatch(postActions.setPostDetailReplyingComment());
  }, [postId]);

  useEffect(() => {
    if (replyTargetUserId && replyTargetUser?.data?.username) {
      let content = `@${replyTargetUser?.data?.username} `;
      if (replyTargetUserId === userId) {
        content = '';
      }
      // difference ref because of android use mention input children, web use prop value
      Platform.OS === 'web'
        ? _commentInputRef?.current?.setText?.(content)
        : mentionInputRef?.current?.setContent(content);
    }
  }, [replyTargetName, replyTargetUserId]);

  useEffect(() => {
    if (!content) {
      _commentInputRef?.current?.clear?.();
      mentionInputRef?.current?.setContent?.('');
    }
  }, [content]);

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
      const payload: IPayloadCreateComment = {
        postId,
        parentCommentId: replyTargetId || defaultReplyTargetId,
        commentData: {content: content?.trim(), images},
        userId: userId,
        onSuccess: _onCommentSuccess,
        isCommentLevel1Screen: isCommentLevel1Screen,
        preComment: {
          status: 'pending',
          // localId is used for finding and updating comment data from API later
          localId: uuid.v4(),
          user_id: userId,
          user: {
            data: {avatar, fullname, username},
          },
          data: {
            content: content?.trim(),
            images,
          },
          activity_id: postId,
          children_counts: {},
          own_children: {},
          latest_children: {},
          created_at: new Date().toISOString(),
          parentCommentId: replyTargetId || defaultReplyTargetId,
        },
      };
      dispatch(postActions.postCreateNewComment(payload));
    }
  };

  const onChangeText = (value: string) => {
    _commentInputRef.current.setText(value);
    dispatch(postActions.setCreateComment({content: value}));
  };

  return (
    <View>
      <MentionInput
        disableAutoComplete={Platform.OS !== 'web'}
        groupIds={groupIds}
        ComponentInput={CommentInput}
        mentionInputRef={mentionInputRef}
        componentInputProps={{
          commentInputRef: _commentInputRef,
          value: content,
          autoFocus: autoFocus,
          HeaderComponent:
            ((!!showHeader || Platform.OS === 'web') && <ReplyingView />) ||
            null,
          loading: loading,
          isHandleUpload: true,
          placeholder: t('post:placeholder_write_comment'),
          onChangeText,
          onPressSend,
        }}
        autocompleteProps={{
          modalPosition: Platform.OS === 'web' ? 'top' : 'above-keyboard',
        }}
      />
    </View>
  );
};

export default CommentInputView;
