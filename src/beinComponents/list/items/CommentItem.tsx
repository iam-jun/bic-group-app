import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {ITheme} from '~/theme/interfaces';
import {useTheme} from 'react-native-paper';
import {IReaction} from '~/interfaces/IPost';
import CommentView from '~/beinFragments/CommentView';
import {useDispatch} from 'react-redux';
import ButtonWrapper from '~/beinComponents/Button/ButtonWrapper';
import postActions from '~/screens/Post/redux/actions';
import _ from 'lodash';
import Text from '~/beinComponents/Text';
import Icon from '~/beinComponents/Icon';

export interface CommentItemProps {
  commentData: IReaction;
  contentBackgroundColor?: string;
  onPressReply?: (data: IReaction) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  commentData,
  contentBackgroundColor,
  onPressReply,
}: CommentItemProps) => {
  const [showAll, setShowAll] = useState(false);
  const [commentChildren, setCommentChildren] = useState<IReaction[]>(
    commentData?.latest_children?.comment || [],
  );

  useEffect(() => {
    if (commentData?.latest_children?.comment) {
      setCommentChildren(commentData?.latest_children?.comment);
    }
  }, [commentData?.latest_children?.comment]);

  const dispatch = useDispatch();
  const theme: ITheme = useTheme();
  const {colors} = theme;
  const styles = createStyle(theme);

  const _onPressReply = (data: IReaction) => {
    dispatch(postActions.setPostDetailReplyingComment(commentData));
    onPressReply?.(commentData);
  };

  const onPressReplyChild = (data: IReaction) => {
    dispatch(postActions.setPostDetailReplyingComment(commentData));
    onPressReply?.(commentData);
  };

  const renderCommentChildItem = ({item}: {item: IReaction}) => {
    return <CommentView commentData={item} onPressReply={onPressReplyChild} />;
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
            <ButtonWrapper
              style={styles.row}
              onPress={() => setShowAll(!showAll)}>
              <Icon
                style={styles.iconShowMore}
                size={16}
                icon={'AngleUp'}
                tintColor={colors.textSecondary}
              />
              <Text.BodyS
                color={
                  theme.colors.textSecondary
                }>{`Show less reply`}</Text.BodyS>
            </ButtonWrapper>
          </View>
        );
      } else {
        return (
          <View style={styles.commentChildrenContainer}>
            {renderCommentChildItem({item: commentChildren[0]})}
            {commentChildren?.length > 1 && (
              <ButtonWrapper
                style={styles.row}
                onPress={() => setShowAll(!showAll)}>
                <Icon
                  style={styles.iconShowMore}
                  size={16}
                  icon={'AngleDown'}
                  tintColor={colors.textSecondary}
                />
                <Text.BodyS
                  color={theme.colors.textSecondary}>{`Show more replies (${
                  commentChildren?.length - 1
                })`}</Text.BodyS>
              </ButtonWrapper>
            )}
          </View>
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <CommentView
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
