import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import Text from '~/beinComponents/Text';
import Button from '~/beinComponents/Button';
import postActions from '~/storeRedux/post/actions';
import CommentPlaceholder from '~/beinComponents/placeholder/CommentPlaceholder';
import spacing from '~/theme/spacing';
import Icon from '~/baseComponents/Icon';

export interface LoadMoreCommentProps {
  style?: StyleProp<ViewStyle>;
  title: string;
  postId: string;
  commentId?: string;
  idLessThan?: string;
  idGreaterThan?: string;
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
  const theme: ExtendedTheme = useTheme();
  const { colors } = theme;
  const styles = createStyle(
    theme, commentId,
  );

  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    height: progress.value,
  }));

  useEffect(
    () => {
      if (loadingMore) {
        progress.value = withTiming(
          150, {
            duration: 400,
            easing: Easing.bezier(
              0.25, 0.1, 0.25, 1,
            ),
          },
        );
      } else {
        progress.value = withTiming(
          0, {
            duration: 1000,
            easing: Easing.bezier(
              0.25, 0.1, 0.25, 1,
            ),
          },
        );
      }
    }, [loadingMore],
  );

  const onPressLoadMore = useCallback(
    () => {
      if (onPress) {
        onPress();
        return;
      }
      if (idLessThan || idGreaterThan) {
        setLoadingMore(true);
        setTimeout(
          () => {
            dispatch(postActions.getCommentsByPostId({
              params: {
                postId,
                order: 'DESC',
                idLt: idLessThan,
                idGt: idGreaterThan,
                parentId: commentId,
                limit: 10,
              },
              isMerge: true,
              callbackLoading: (loading) => setLoadingMore(loading),
            }));
          }, 150,
        );
      }
    }, [commentId, idLessThan, idGreaterThan],
  );

  return (
    <View>
      <View style={StyleSheet.flatten([styles.container, style])}>
        <Icon
          icon="ArrowRotateRight"
          tintColor={colors.neutral40}
          size={10}
          style={styles.icon}
        />
        <Button onPress={onPressLoadMore} testID="load_more_comments.button">
          <Text.BodyXSMedium style={styles.textLoadMoreComment} useI18n>
            {title}
          </Text.BodyXSMedium>
        </Button>
        <ActivityIndicator color={colors.gray30} animating={loadingMore} />
      </View>
      <Animated.View style={[styles.placeholder, animatedStyle]}>
        <CommentPlaceholder />
        <CommentPlaceholder />
      </Animated.View>
    </View>
  );
};

const createStyle = (
  theme: ExtendedTheme, commentId?: string,
) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
    },
    textLoadMoreComment: {
      margin: spacing.margin.small,
    },
    placeholder: {
      marginLeft: commentId ? 36 : 0,
    },
    icon: {
      marginLeft: spacing.margin.small,
    },
  });
};

const LoadMoreComment = React.memo(_LoadMoreComment);
LoadMoreComment.whyDidYouRender = true;
export default LoadMoreComment;
