import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {IReaction} from '~/interfaces/IPost';
import {useDispatch} from 'react-redux';
import postActions from '~/screens/Post/redux/actions';
import CommentView from '~/screens/Post/components/CommentView';

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
  const theme: ITheme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const _onPressReply = () => {
    dispatch(
      postActions.setPostDetailReplyingComment(commentParent || commentData),
    );
    onPressReply?.(commentData);
  };

  return (
    <View style={commentParent ? styles.containerChild : styles.container}>
      <CommentView
        postId={postId}
        groupIds={groupIds}
        commentData={commentData}
        onPressReply={_onPressReply}
        contentBackgroundColor={contentBackgroundColor}
      />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      paddingTop: spacing?.padding.small,
      paddingBottom: spacing?.padding.base,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.background,
    },
    containerChild: {
      paddingTop: spacing?.padding.small,
      paddingBottom: spacing?.padding.base,
      paddingRight: spacing?.padding.large,
      paddingLeft: 68,
      backgroundColor: colors.background,
    },
  });
};

export default CommentItem;
