import React, {useCallback, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {useTheme} from 'react-native-paper';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {ITheme} from '~/theme/interfaces';
import {IReaction} from '~/interfaces/IPost';
import postActions from '~/screens/Post/redux/actions';
import CommentView from '~/screens/Post/components/CommentView';
import LoadMoreComment from '~/screens/Post/components/LoadMoreComment';
import {useBaseHook} from '~/hooks';
import ViewSpacing from '~/beinComponents/ViewSpacing';

export interface CommentItemProps {
  postId: string;
  groupIds: string;
  commentData: IReaction;
  commentParent?: IReaction;
  contentBackgroundColor?: string;
  onPressReply?: (data: IReaction, isChild?: boolean) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  groupIds,
  commentData,
  commentParent,
  contentBackgroundColor,
  onPressReply,
}: CommentItemProps) => {
  const dispatch = useDispatch();
  const {t} = useBaseHook();
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.33, 1], [0, 0.5, 1]),
  }));

  useEffect(() => {
    showComment();
  }, []);

  const showComment = (duration = 300) => {
    progress.value = withTiming(1, {duration});
  };

  const _onPressReply = useCallback(() => {
    dispatch(
      postActions.setPostDetailReplyingComment({
        comment: commentData,
        parentComment: commentParent,
      }),
    );
    onPressReply?.(commentData);
  }, [commentData, commentParent]);

  const childCommentCount = commentData?.children_counts?.comment || 0;
  const loadedChildComment = commentData?.latest_children?.comment?.length || 0;
  const childCommentLeft = childCommentCount - loadedChildComment;
  const idLessThan = commentData?.latest_children?.comment?.[0]?.id;

  return (
    <Animated.View
      style={
        commentParent
          ? [styles.containerChild, animatedStyle]
          : [styles.container, animatedStyle]
      }>
      <CommentView
        postId={postId}
        groupIds={groupIds}
        commentData={commentData}
        onPressReply={_onPressReply}
        contentBackgroundColor={contentBackgroundColor}
      />
      {childCommentLeft > 0 ? (
        <LoadMoreComment
          style={styles.childLoadMore}
          title={t('post:text_load_more_x_replies').replace(
            '%VALUE%',
            childCommentLeft,
          )}
          postId={postId}
          commentId={commentData?.id}
          idLessThan={idLessThan}
        />
      ) : (
        <ViewSpacing height={0} />
      )}
    </Animated.View>
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
