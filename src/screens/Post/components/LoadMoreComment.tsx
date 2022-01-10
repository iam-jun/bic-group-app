import React, {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import postActions from '~/screens/Post/redux/actions';
import {useDispatch} from 'react-redux';

export interface LoadMoreCommentProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  postId: string;
  commentId?: string;
  idLessThan: string;
}

const LoadMoreComment: FC<LoadMoreCommentProps> = ({
  style,
  title,
  postId,
  commentId,
  idLessThan,
}: LoadMoreCommentProps) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme);

  const onPressLoadMore = () => {
    if (idLessThan) {
      dispatch(
        postActions.getCommentsByPostId({
          postId: postId,
          idLt: idLessThan,
          commentId: commentId,
          recentReactionsLimit: commentId ? 3 : 10,
          isMerge: true,
          callbackLoading: loading => setLoadingMore(loading),
        }),
      );
    }
  };

  return (
    <View style={StyleSheet.flatten([styles.container, style])}>
      <Button onPress={onPressLoadMore}>
        <Text.H6 style={styles.textLoadMoreComment} useI18n>
          {title}
        </Text.H6>
      </Button>
      <ActivityIndicator color={colors.disabled} animating={loadingMore} />
    </View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    textLoadMoreComment: {
      margin: spacing.margin.small,
      color: colors.textPrimary,
    },
  });
};

export default LoadMoreComment;
