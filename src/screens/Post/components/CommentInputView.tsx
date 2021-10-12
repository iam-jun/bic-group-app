import React, {FC, useEffect, useRef} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import CommentInput, {
  ICommentInputSendParam,
} from '~/beinComponents/inputs/CommentInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';

import Text from '~/beinComponents/Text';
import {useBaseHook} from '~/hooks';
import {useUserIdAuth} from '~/hooks/auth';
import {useKeySelector} from '~/hooks/selector';
import {
  IActivityDataImage,
  IPayloadCreateComment,
  IPayloadReplying,
} from '~/interfaces/IPost';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import postActions from '~/screens/Post/redux/actions';
import postKeySelector from '~/screens/Post/redux/keySelector';

import {ITheme} from '~/theme/interfaces';

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
  const replyTargetName = replyTargetUser?.data?.fullname;
  const replyTargetUserId = replyTargetUser?.id;

  const content = useKeySelector(postKeySelector.createComment.content) || '';
  const loading = useKeySelector(postKeySelector.createComment.loading);

  useEffect(() => {
    dispatch(postActions.setPostDetailReplyingComment());
    return () => {
      dispatch(postActions.setCreateComment({content: '', loading: false}));
    };
  }, []);

  useEffect(() => {
    if (replyTargetUserId && replyTargetUserId) {
      _commentInputRef?.current?.setText?.(
        `@[u:${replyTargetUserId}:${replyTargetName}] `,
      );
    }
  }, [replyTargetName, replyTargetUserId]);

  const _onCommentSuccess = (data?: any) => {
    onCommentSuccess?.(data);
    _commentInputRef?.current?.clear?.();
  };

  const onPressSend = (sendData?: ICommentInputSendParam) => {
    if (postId) {
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
    dispatch(postActions.setCreateComment({content: value}));
  };

  const renderCommentInputHeader = () => {
    if (!replying) {
      return null;
    }
    return (
      <View style={styles.commentInputHeader}>
        <View style={styles.headerContent}>
          <Text color={colors.textSecondary}>
            {t('post:label_replying_to')}
            <Text.BodyM>{replyTargetName || t('post:someone')}</Text.BodyM>
            <Text.BodyS color={colors.textSecondary}>
              {'  • '}
              <Text.BodyM
                useI18n
                color={colors.textSecondary}
                onPress={() =>
                  !loading &&
                  dispatch(postActions.setPostDetailReplyingComment())
                }>
                common:btn_cancel
              </Text.BodyM>
            </Text.BodyS>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <MentionInput
      modalPosition={'top'}
      onChangeText={onChangeText}
      ComponentInput={CommentInput}
      textInputRef={textInputRef}
      componentInputProps={{
        commentInputRef: _commentInputRef,
        value: content,
        autoFocus: autoFocus,
        onPressSend: onPressSend,
        HeaderComponent: renderCommentInputHeader(),
        loading: loading,
        isHandleUpload: true,
      }}
      title={t('post:mention_title')}
      emptyContent={t('post:mention_empty_content')}
      getDataPromise={postDataHelper.getSearchMentionAudiences}
      getDataParam={{group_ids: groupIds}}
      getDataResponseKey={'data'}
      modalStyle={Platform.OS !== 'web' && styles.mentionModalStyle}
      showShadow={Platform.OS !== 'web' && false}
    />
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;

  return StyleSheet.create({
    container: {},
    flex1: {flex: 1},
    row: {flexDirection: 'row'},
    commentInputHeader: {
      flexDirection: 'row',
      marginHorizontal: spacing?.margin.base,
      marginTop: spacing?.margin.tiny,
    },
    headerContent: {
      flex: 1,
      flexDirection: 'row',
    },
    mentionModalStyle: {
      width: '100%',
      maxWidth: undefined,
      maxHeight: 300,
      borderWidth: 1,
      borderColor: colors.borderDivider,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  });
};

export default CommentInputView;
