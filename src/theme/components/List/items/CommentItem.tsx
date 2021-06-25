import React from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  TouchableOpacity,
} from 'react-native';
import Avatar from '../../Image/Avatar';
import HorizontalView from '../../Layout/HorizontalView';
import ThemeView from '../../ThemeView';
import Text from '~/theme/components/Text';
import {margin, padding} from '~/theme/configs/spacing';
import {useBaseHook} from '~/hooks';
import ListView from '../ListView';
import {dummyReplies} from '~/screens/Home/PostDetail/dummy-replies';
import {UserType} from './GroupItem';
import {IObject} from '~/interfaces/common';
import {useTheme} from 'react-native-paper';

export interface Props {
  style?: StyleProp<ViewStyle>;
  user: UserType;
  content: string;
  replyCount?: number;
  createdAt?: string;
}

const CommentItem: React.FC<Props> = ({
  style,
  user,
  content,
  replyCount,
  createdAt,
}) => {
  const {t} = useBaseHook();
  const theme: IObject<any> = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <HorizontalView>
        <Avatar
          user={user}
          size={replyCount && replyCount > 0 ? 'base' : 'small'}
        />
        <View style={styles.content}>
          <TouchableOpacity delayLongPress={1000}>
            <View style={styles.header}>
              <Text bold>{user?.fullName}</Text>
              <Text>{content}</Text>
            </View>
          </TouchableOpacity>
          <HorizontalView style={styles.bottomBar}>
            <HorizontalView style={styles.commentReaction}>
              <Text style={styles.commentReactionItem}>{createdAt}</Text>
              <TouchableOpacity>
                <Text style={styles.commentReactionItem} bold>
                  {t('post:button_like')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.commentReactionItem} bold>
                  {t('post:button_reply')}
                </Text>
              </TouchableOpacity>
            </HorizontalView>
          </HorizontalView>
        </View>
      </HorizontalView>

      {/* TODO: need to use another method to display replies */}
      {/* temporarily using dummy replies */}
      {replyCount && replyCount > 0 && (
        <ListView type="comment" data={dummyReplies} style={styles.replies} />
      )}
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
      paddingTop: padding.large,
      marginStart: 44,
      marginBottom: 6,
    },
  });
};

export default CommentItem;
