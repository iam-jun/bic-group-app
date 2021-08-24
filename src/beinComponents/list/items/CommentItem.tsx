import React, {useEffect, useState, useCallback} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {IReaction} from '~/interfaces/IPost';
import {useDispatch} from 'react-redux';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import postActions from '~/screens/Post/redux/actions';
import _ from 'lodash';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';
import CommentView from '~/screens/Post/components/CommentView';
import {IconType} from '~/resources/icons';

export interface CommentItemProps {
  postId: string;
  commentData: IReaction;
  contentBackgroundColor?: string;
  onPressReply?: (data: IReaction, isChild?: boolean) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  commentData,
  contentBackgroundColor,
  onPressReply,
}: CommentItemProps) => {
  const [showAll, setShowAll] = useState(true);
  const [commentChildren, setCommentChildren] = useState<IReaction[]>(
    commentData?.latest_children?.comment || [],
  );

  useEffect(() => {
    if (commentData?.latest_children?.comment) {
      setCommentChildren(commentData?.latest_children?.comment);
    }
  }, [commentData?.latest_children?.comment]);

  const dispatch = useDispatch();
  const theme: ITheme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const _onPressReply = (data: IReaction, isChild?: boolean) => {
    dispatch(postActions.setPostDetailReplyingComment(commentData));
    onPressReply?.(commentData);
  };

  const onPressReplyChild = (data: IReaction) => {
    dispatch(postActions.setPostDetailReplyingComment(commentData));
    onPressReply?.(commentData, true);
  };

  const renderCommentChildItem = useCallback(({item}) => {
    return (
      <CommentView
        postId={postId}
        commentData={item}
        onPressReply={onPressReplyChild}
      />
    );
  }, []);

  const renderButtonShow = (icon: IconType, title: string) => {
    return (
      <ButtonWrapper style={styles.row} onPress={() => setShowAll(!showAll)}>
        <Icon
          style={styles.iconShowMore}
          size={16}
          icon={icon}
          tintColor={colors.textSecondary}
        />
        <Text.BodyS color={theme.colors.textSecondary}>{title}</Text.BodyS>
      </ButtonWrapper>
    );
  };

  const renderCommentChildren = () => {
    if (commentChildren?.length <= 0) {
      return null;
    } else {
      if (showAll) {
        return (
          <View style={styles.commentChildrenContainer}>
            <FlatList
              data={commentChildren}
              renderItem={renderCommentChildItem}
              ItemSeparatorComponent={() => (
                <View style={styles.childrenSeparator} />
              )}
              keyExtractor={(item, index) =>
                `list-${index}-${item.id}` || _.uniqueId(`list-${index}`)
              }
            />
            {/*{renderButtonShow('AngleUp', 'Show less reply')}*/}
          </View>
        );
      } else {
        return (
          <View style={styles.commentChildrenContainer}>
            {renderCommentChildItem({item: commentChildren[0]})}
            {commentChildren?.length > 1 &&
              renderButtonShow(
                'AngleDown',
                `Show more replies (${commentChildren?.length - 1})`,
              )}
          </View>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <CommentView
        postId={postId}
        commentData={commentData}
        onPressReply={_onPressReply}
        contentBackgroundColor={contentBackgroundColor}
      />
      {renderCommentChildren()}
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
    commentChildrenContainer: {
      marginLeft: 40,
      marginTop: spacing?.margin.base,
    },
    childrenSeparator: {
      marginTop: spacing?.margin.base,
    },
    iconShowMore: {
      marginRight: spacing?.margin.small,
    },
    row: {flexDirection: 'row'},
  });
};

export default CommentItem;
