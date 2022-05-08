import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  Platform,
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
  postId: number;
  commentId?: number;
  idLessThan?: number;
  idGreaterThan?: number;
  onPress?: () => void;
}

const _LoadMoreComment: FC<LoadMoreCommentProps> = ({
  style,
  title,
  postId,
  commentId,
  idLessThan,
  idGreaterThan,
  onPress,
}: LoadMoreCommentProps) => {
  const [loadingMore, setLoadingMore] = useState(false);

  const dispatch = useDispatch();
  const theme = useTheme() as ITheme;
  const {colors} = theme;
  const styles = createStyle(theme, commentId);

  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: progress.value,
    };
  });

  useEffect(() => {
    if (Platform.OS !== 'web') {
      if (loadingMore) {
        progress.value = withTiming(150, {
          duration: 400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      } else {
        progress.value = withTiming(0, {
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      }
    }
  }, [loadingMore]);

  const onPressLoadMore = useCallback(() => {
    if (!!onPress) {
      onPress();
      return;
    }
    if (idLessThan || idGreaterThan) {
      if (Platform.OS !== 'web') {
        setLoadingMore(true);
        setTimeout(() => {
          dispatch(
            postActions.getCommentsByPostId({
              postId: postId,
              order: 'DESC',
              idLT: idLessThan,
              idGT: idGreaterThan,
              parentId: commentId,
              limit: 10,
              isMerge: true,
              callbackLoading: loading => setLoadingMore(loading),
            }),
          );
        }, 150);
      } else {
        dispatch(
          postActions.getCommentsByPostId({
            postId: postId,
            idLT: idLessThan,
            parentId: commentId,
            limit: commentId ? 3 : 10,
            isMerge: true,
            callbackLoading: loading => setLoadingMore(loading),
          }),
        );
      }
    }
  }, [commentId, idLessThan, idGreaterThan]);

  return (
    <View>
      <View style={StyleSheet.flatten([styles.container, style])}>
        <Button onPress={onPressLoadMore} testID="load_more_comments.button">
          <Text.H6 style={styles.textLoadMoreComment} useI18n>
            {title}
          </Text.H6>
        </Button>
        <ActivityIndicator color={colors.disabled} animating={loadingMore} />
      </View>
      {Platform.OS !== 'web' && (
        <Animated.View style={[styles.placeholder, animatedStyle]}>
          <CommentPlaceholder />
          <CommentPlaceholder />
        </Animated.View>
      )}
    </View>
  );
};

const createStyle = (theme: ITheme, commentId?: number) => {
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
    placeholder: {
      marginLeft: commentId ? 36 : 0,
    },
  });
};

const LoadMoreComment = React.memo(_LoadMoreComment);
LoadMoreComment.whyDidYouRender = true;
export default LoadMoreComment;
