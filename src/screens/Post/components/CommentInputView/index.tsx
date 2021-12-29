import React, {FC, useEffect, useRef} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import CommentInput, {
  ICommentInputSendParam,
} from '~/beinComponents/inputs/CommentInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import _MentionInput from '~/beinComponents/inputs/_MentionInput';

import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {useKeySelector} from '~/hooks/selector';
import {
  IActivityDataImage,
  IPayloadCreateComment,
  IPayloadReplying,
} from '~/interfaces/IPost';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';

import {ITheme} from '~/theme/interfaces';
import ReplyingView from './ReplyingView';

export interface CommentInputViewProps {
  postId: string;
  groupIds: string;
  autoFocus?: boolean;
  textInputRef?: any;
  commentInputRef?: any;
  onCommentSuccess?: (data: {
    newCommentId: string;
    parentCommentId?: string;
  }) => void;
}

const CommentInputView: FC<CommentInputViewProps> = ({
  postId,
  groupIds = '',
  autoFocus,
  textInputRef,
  commentInputRef,
  onCommentSuccess,
}: CommentInputViewProps) => {
  const _commentInputRef = commentInputRef || useRef<any>();
  const mentionInputRef = useRef<any>();

  const dispatch = useDispatch();
  const {t} = useBaseHook();

  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

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
    if (replyTargetUserId && replyTargetUserId) {
      let content = `@[u:${replyTargetUserId}:${replyTargetName}] `;
      if (replyTargetUserId === userId) {
        content = '';
      }
      // difference ref because of android use mention input children, web use prop value
      Platform.OS === 'web'
        ? _commentInputRef?.current?.setText?.(content)
        : mentionInputRef?.current?.setContent(content);
    }
  }, [replyTargetName, replyTargetUserId]);

  const _onCommentSuccess = (data?: any) => {
    onCommentSuccess?.(data);
    _commentInputRef?.current?.clear?.();
  };

  const onPressSend = (sendData?: ICommentInputSendParam) => {
    if (postId && !loading) {
      const images: IActivityDataImage[] = [];
      if (sendData?.image) {
        images.push(sendData?.image);
      }
      const payload: IPayloadCreateComment = {
        postId,
        parentCommentId: replyTargetId,
        commentData: {content: content?.trim(), images},
        userId: userId,
        onSuccess: _onCommentSuccess,
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
      <_MentionInput
        groupIds={groupIds}
        ComponentInput={CommentInput}
        componentInputProps={{
          commentInputRef: _commentInputRef,
          value: content,
          autoFocus: autoFocus,
          HeaderComponent: <ReplyingView />,
          loading: loading,
          isHandleUpload: true,
          placeholder: t('post:placeholder_write_comment'),
          onChangeText,
          onPressSend,
        }}
      />
    </View>
  );

  // return (
  //   <MentionInput
  //     mentionInputRef={mentionInputRef}
  //     modalPosition={'top'}
  //     onChangeText={onChangeText}
  //     ComponentInput={CommentInput}
  //     textInputRef={textInputRef}
  //     componentInputProps={{
  //       commentInputRef: _commentInputRef,
  //       value: content,
  //       autoFocus: autoFocus,
  //       onPressSend: onPressSend,
  //       HeaderComponent: renderCommentInputHeader(),
  //       loading: loading,
  //       isHandleUpload: true,
  //       placeholder: t('post:placeholder_write_comment'),
  //     }}
  //     title={t('post:mention_title')}
  //     emptyContent={t('post:mention_empty_content')}
  //     getDataPromise={postDataHelper.getSearchMentionAudiences}
  //     getDataParam={{group_ids: groupIds}}
  //     getDataResponseKey={'data'}
  //     fullWidth={Platform.OS !== 'web'}
  //     showShadow={Platform.OS === 'web'}
  //   />
  // );
};

const createStyle = (theme: ITheme) => {
  const {spacing, colors} = theme;

  return StyleSheet.create({
    container: {},
    flex1: {flex: 1},
    row: {flexDirection: 'row'},
    commentInputHeader: {
      flexDirection: 'row',
      paddingHorizontal: spacing.padding.small,
      paddingBottom: spacing.padding.small,
      marginHorizontal: spacing?.margin.small,
      marginTop: spacing?.margin.small,
      borderBottomWidth: 1,
      borderColor: colors.borderDivider,
    },
    headerContent: {
      flex: 1,
      flexDirection: 'row',
    },
  });
};

export default CommentInputView;
