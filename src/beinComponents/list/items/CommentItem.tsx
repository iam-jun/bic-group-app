import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { useBaseHook } from '~/hooks';
import { ICommentData, IPostAudience } from '~/interfaces/IPost';
import CommentView from '~/screens/comments/components/CommentView';
import LoadMoreComment from '~/components/LoadMoreComment';
import spacing from '~/theme/spacing';
import usePostsStore from '~/store/entities/posts';

export interface CommentItemProps {
  postId: string;
  index?: number;
  section?: any;
  groupIds: string;
  audience: IPostAudience;
  commentData: ICommentData;
  commentParent?: ICommentData;
  contentBackgroundColor?: string;
  isReplyingComment?: boolean;
  onPressLoadMore?: (data: any) => void;
  onPressMarkSeenPost?: ()=> void;
  onPressReply?: (data: ICommentData, section?: any, index?: number) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  index,
  groupIds,
  audience,
  section,
  commentData,
  commentParent,
  contentBackgroundColor,
  isReplyingComment = true,
  onPressReply,
  onPressLoadMore,
  onPressMarkSeenPost,
}: CommentItemProps) => {
  const { t } = useBaseHook();
  const postActions = usePostsStore((state) => state.actions);
  const theme: ExtendedTheme = useTheme();
  const styles = React.useMemo(
    () => createStyle(theme), [theme],
  );

  const _onPressReply = useCallback(
    () => {
      if (isReplyingComment) {
        postActions.setPostDetailReplyingComment({
          comment: commentData,
          parentComment: commentParent,
        });
      }
      onPressReply?.(
        commentData, section, index,
      );
    }, [commentData, commentParent, section, index],
  );

  // const _onPressLoadMore = useCallback(
  //   () => {
  //     onPressLoadMore && onPressLoadMore(commentData);
  //   }, [commentData],
  // );

  const _onPressLoadMore = () => onPressLoadMore?.(commentData);

  const childCommentCount = commentData?.totalReply || 0;

  const endCursor = commentData?.child?.meta?.endCursor;
  const showLoadPrevious = onPressLoadMore
    ? childCommentCount - 1 > 0
    : commentData?.child?.meta?.hasNextPage || false;

  return (
    <View style={commentParent ? styles.containerChild : styles.container}>
      <CommentView
        postId={postId}
        groupIds={groupIds}
        audience={audience}
        parentCommentId={commentParent?.id}
        commentData={commentData}
        onPressReply={_onPressReply}
        contentBackgroundColor={contentBackgroundColor}
        onPressMarkSeenPost={onPressMarkSeenPost}
      />
      {showLoadPrevious && (
        <LoadMoreComment
          style={styles.childLoadMore}
          title={t('post:text_load_previous_replies')}
          postId={postId}
          commentId={commentData?.id}
          endCursor={endCursor}
          onPress={!!onPressLoadMore ? _onPressLoadMore : undefined}
        />
      )}
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      paddingTop: spacing?.padding.base,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.white,
    },
    containerChild: {
      paddingTop: spacing?.padding.base,
      paddingRight: spacing?.padding.large,
      paddingLeft: 68,
      backgroundColor: colors.white,
    },
    childLoadMore: { marginLeft: 40 },
  });
};

export default CommentItem;
