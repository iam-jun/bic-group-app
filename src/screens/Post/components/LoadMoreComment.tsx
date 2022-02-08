import React, {FC, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {ITheme} from '~/theme/interfaces';

import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import postActions from '~/screens/Post/redux/actions';
import {useDispatch} from 'react-redux';
import CommentPlaceholder from '~/beinComponents/placeholder/CommentPlaceholder';

export interface LoadMoreCommentProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  postId: string;
  commentId?: string;
  idLessThan: string;
}

const _LoadMoreComment: FC<LoadMoreCommentProps> = ({
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

  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: progress.value,
    };
  });

  useEffect(() => {
    if (loadingMore) {
      progress.value = withTiming(120, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      progress.value = withTiming(0, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [loadingMore]);

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
    <View>
      <View style={StyleSheet.flatten([styles.container, style])}>
        <Button onPress={onPressLoadMore}>
          <Text.H6 style={styles.textLoadMoreComment} useI18n>
            {title}
          </Text.H6>
        </Button>
        <ActivityIndicator color={colors.disabled} animating={loadingMore} />
      </View>
      <Animated.View style={animatedStyle}>
        <CommentPlaceholder />
        <CommentPlaceholder />
      </Animated.View>
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

const LoadMoreComment = React.memo(_LoadMoreComment);
LoadMoreComment.whyDidYouRender = true;
export default LoadMoreComment;
