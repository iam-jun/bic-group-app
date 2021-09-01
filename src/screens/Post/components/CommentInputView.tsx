import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import CommentInput from '~/beinComponents/inputs/CommentInput';
import MentionInput from '~/beinComponents/inputs/MentionInput';
import postActions from '~/screens/Post/redux/actions';
import {useDispatch} from 'react-redux';
import {IRequestPostComment} from '~/interfaces/IPost';
import postDataHelper from '~/screens/Post/helper/PostDataHelper';
import {useUserIdAuth} from '~/hooks/auth';
import {usePostDetailReplyingComment} from '~/hooks/post';
import {useBaseHook} from '~/hooks';
import {useKeySelector} from '~/hooks/selector';
import postKeySelector from '~/screens/Post/redux/keySelector';

export interface CommentInputViewProps {
  postId: string;
  groupIds: string;
  autoFocus?: boolean;
  textInputRef?: any;
}

const CommentInputView: FC<CommentInputViewProps> = ({
  postId,
  groupIds = '',
  autoFocus,
  textInputRef,
}: CommentInputViewProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const userId = useUserIdAuth();

  const replying = usePostDetailReplyingComment();

  const content = useKeySelector(postKeySelector.createComment.content) || '';
  const loading = useKeySelector(postKeySelector.createComment.loading);

  useEffect(() => {
    dispatch(postActions.setPostDetailReplyingComment());
  }, []);

  const onPressSend = () => {
    if (postId) {
      const commentData = {content: content?.trim()};
      const replyCmtId = replying?.id;
      const requestData: IRequestPostComment = {
        referenceId: replyCmtId || postId,
        referenceType: replyCmtId ? 'comment' : 'post',
        commentData,
        userId,
      };
      dispatch(postActions.setCreateComment({loading: true}));
      postDataHelper
        .postNewComment(requestData)
        .then(response => {
          if (response && response.data) {
            dispatch(postActions.getCommentsByPostId({postId, isMerge: false}));
            dispatch(postActions.setPostDetailReplyingComment());
            dispatch(
              postActions.setCreateComment({loading: false, content: ''}),
            );
          }
        })
        .catch(e => {
          dispatch(postActions.setCreateComment({loading: false}));
          console.log('\x1b[33m', '🐣️ postNewComment error : ', e, '\x1b[0m');
        });
    } else {
      console.log('\x1b[31m', '🐣️  | onPressSend : invalid id ', '\x1b[0m');
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
            <Text.BodyM>
              {replying?.user?.data?.fullname || t('post:someone')}
            </Text.BodyM>
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
      value={content}
      ComponentInput={CommentInput}
      componentInputProps={{
        textInputRef: textInputRef,
        value: content,
        autoFocus: autoFocus,
        onPressSend: onPressSend,
        HeaderComponent: renderCommentInputHeader(),
        loading: loading,
      }}
      title={t('post:mention_title')}
      emptyContent={t('post:mention_empty_content')}
      getDataPromise={postDataHelper.getSearchMentionAudiences}
      getDataParam={{group_ids: groupIds}}
      getDataResponseKey={'data'}
    />
  );
};

const createStyle = (theme: ITheme) => {
  const {spacing} = theme;
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
  });
};

export default CommentInputView;
