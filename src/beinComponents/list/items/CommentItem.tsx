import React, {useCallback} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';
import {ICommentData, IReaction} from '~/interfaces/IPost';
import postActions from '~/screens/Post/redux/actions';
import CommentView from '~/screens/Post/components/CommentView';
import LoadMoreComment from '~/screens/Post/components/LoadMoreComment';
import {useBaseHook} from '~/hooks';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface CommentItemProps {
  postId: string;
  groupIds: string;
  commentData: ICommentData;
  commentParent?: ICommentData;
  contentBackgroundColor?: string;
  section?: any;
  index?: number;
  onPressReply?: (data: IReaction, section?: any, index?: number) => void;
  onPressLoadMore?: (data: any) => void;
  isNotReplyingComment?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  groupIds,
  commentData,
  commentParent,
  contentBackgroundColor,
  section,
  index,
  onPressReply,
  onPressLoadMore,
  isNotReplyingComment,
}: CommentItemProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = React.useMemo(() => createStyle(theme), [theme]);

  const _onPressReply = useCallback(() => {
    if (Platform.OS === 'web' || !isNotReplyingComment) {
      dispatch(
        postActions.setPostDetailReplyingComment({
          comment: commentData,
          parentComment: commentParent,
        }),
      );
    }
    onPressReply?.(commentData, section, index);
  }, [commentData, commentParent, section, index]);

  const _onPressLoadMore = useCallback(() => {
    onPressLoadMore && onPressLoadMore(commentData);
  }, [commentData]);

  const childCommentCount = commentData?.totalReply || 0;
  const loadedChildComment = commentData?.child?.list?.length || 0;
  const childCommentLeft =
    !!onPressLoadMore && Platform.OS !== 'web'
      ? childCommentCount - 1
      : childCommentCount - loadedChildComment;
  const idLessThan = commentData?.child?.list?.[0]?.id;
  const showLoadPrevious =
    !!onPressLoadMore && Platform.OS !== 'web'
      ? childCommentCount - 1 > 0
      : commentData?.child?.meta?.hasNextPage || false;

  return (
    <View style={commentParent ? styles.containerChild : styles.container}>
      <CommentView
        postId={postId}
        groupIds={groupIds}
        parentCommentId={commentParent?.id}
        commentData={commentData}
        onPressReply={_onPressReply}
        contentBackgroundColor={contentBackgroundColor}
      />
      {!!showLoadPrevious ? (
        <LoadMoreComment
          style={styles.childLoadMore}
          title={t('post:text_load_previous_replies')}
          postId={postId}
          commentId={commentData?.id}
          idLessThan={idLessThan}
          onPress={!!onPressLoadMore ? _onPressLoadMore : undefined}
        />
      ) : (
        <ViewSpacing height={0} />
      )}
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingTop: spacing?.padding.small,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.background,
    },
    containerChild: {
      paddingTop: spacing?.padding.small,
      paddingRight: spacing?.padding.large,
      paddingLeft: 68,
      backgroundColor: colors.background,
    },
    childLoadMore: {marginLeft: 40},
  });
};

export default CommentItem;
