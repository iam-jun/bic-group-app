import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  FC, useCallback, useEffect, useState,
} from 'react';
import {
  ActivityIndicator,
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import Animated, {
  Easing, useAnimatedStyle, useSharedValue, withTiming,
} from 'react-native-reanimated';

import Icon from '~/baseComponents/Icon';
import Button from '~/beinComponents/Button';
import CommentPlaceholder from '~/beinComponents/placeholder/CommentPlaceholder';
import Text from '~/beinComponents/Text';
import spacing from '~/theme/spacing';
import useLoadMoreCommentsController from './store';

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

  const controller = useLoadMoreCommentsController((state) => state.actions);
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
            controller.getCommentsByPostId({
              params: {
                postId,
                order: 'DESC',
                idLt: idLessThan,
                idGt: idGreaterThan,
                parentId: commentId,
              },
              callbackLoading: (loading) => setLoadingMore(loading),
            });
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
        <Button testID="load_more_comments.button" onPress={onPressLoadMore}>
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
