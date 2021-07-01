import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Avatar from '../../Image/Avatar';
import HorizontalView from '../../Layout/HorizontalView';
import Text from '~/theme/components/Text';
import {margin, padding} from '~/theme/configs/spacing';
import {useBaseHook} from '~/hooks';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';
import commonActions from '~/constants/commonActions';
import IComment from '~/interfaces/IComment';

const CommentItem: React.FC<IComment> = ({
  style,
  user,
  content,
  replyCount,
  createdAt,
  onActionPress,
}) => {
  const {t} = useBaseHook();
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <HorizontalView style={replyCount >= 0 ? null : styles.replies}>
        <Avatar user={user} size={replyCount >= 0 ? 'base' : 'small'} />
        <View style={styles.content}>
          <TouchableOpacity delayLongPress={1000}>
            <View style={styles.header}>
              <Text bold>{user?.name}</Text>
              <Text>{content}</Text>
            </View>
          </TouchableOpacity>
          <HorizontalView style={styles.bottomBar}>
            <HorizontalView style={styles.commentReaction}>
              <Text style={styles.commentReactionItem}>{createdAt}</Text>
              <TouchableOpacity
                onPress={() => onActionPress(commonActions.emojiCommentReact)}>
                <Text style={styles.commentReactionItem} bold>
                  {t('post:button_like')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  onActionPress(commonActions.replyComment, {user, content})
                }>
                <Text style={styles.commentReactionItem} bold>
                  {t('post:button_reply')}
                </Text>
              </TouchableOpacity>
            </HorizontalView>
          </HorizontalView>
        </View>
      </HorizontalView>
    </View>
  );
};

const createStyles = (theme: IObject<any>) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      marginVertical: margin.tiny,
      marginHorizontal: margin.base,
    },
    content: {
      flex: 1,
      marginStart: 6,
    },
    header: {
      borderRadius: 16,
      paddingHorizontal: padding.large,
      paddingVertical: padding.small,
      backgroundColor: colors.background,
      alignSelf: 'baseline',
      flex: 0,
    },
    bottomBar: {
      width: '100%',
      marginStart: margin.large,
      marginTop: 2,
    },
    commentReaction: {
      alignItems: 'flex-end',
    },
    commentReactionItem: {
      marginEnd: margin.small,
      fontSize: 11,
    },
    replies: {
      marginStart: 44,
    },
  });
};

export default React.memo(CommentItem);
