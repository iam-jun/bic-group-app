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
    };
  }, []);

  useEffect(() => {
    if (replyTargetUserId && replyTargetUserId) {
      let content = `@[u:${replyTargetUserId}:${replyTargetName}] `;
      if (replyTargetUserId === userId) {
        content = '';
      }
      _commentInputRef?.current?.setText?.(content);
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
        placeholder: t('post:placeholder_write_comment'),
      }}
      title={t('post:mention_title')}
      emptyContent={t('post:mention_empty_content')}
      getDataPromise={postDataHelper.getSearchMentionAudiences}
      getDataParam={{group_ids: groupIds}}
      getDataResponseKey={'data'}
      fullWidth={Platform.OS !== 'web'}
      showShadow={Platform.OS === 'web'}
    />
  );
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
