import React from 'react';
import {
  StyleSheet, View, StyleProp, ViewStyle,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated from 'react-native-reanimated';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';
import { getRandomInt } from '~/utils/generator';
import { useSkeletonAnimation } from '~/hooks/useSkeletonAnimation';
import ViewSpacing from '../../beinComponents/ViewSpacing';

export interface CommentPlaceholderProps {
  style?: StyleProp<ViewStyle>;
  isChildComment?: boolean;
}

const CommentPlaceholder: React.FC<CommentPlaceholderProps> = ({
  style,
  isChildComment,
}: CommentPlaceholderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const animatedStyle = useSkeletonAnimation({ targetOpacityValue: 0.5, speed: 500 });

  return (
    <View style={StyleSheet.flatten([styles.container, styles.row, style])}>
      {
        Boolean(isChildComment) && (
          <View style={[styles.avatar, styles.avatarHidden]} />
        )
      }
      <Animated.View style={[styles.avatar, animatedStyle]} />
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.line, styles.firstLine, animatedStyle]} />
        <ViewSpacing height={spacing.margin.small} />
        <Animated.View style={[styles.line, styles.secondLine, animatedStyle]} />
      </View>
    </View>
  );
};

export default CommentPlaceholder;

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    container: {
      backgroundColor: colors.white,
      paddingHorizontal: spacing.padding.large,
      paddingVertical: spacing.padding.small,
    },
    avatar: {
      width: dimension.avatarSizes.medium,
      height: dimension.avatarSizes.medium,
      marginRight: spacing.margin.small,
      borderRadius: spacing.borderRadius.pill,
      backgroundColor: colors.neutral5,
    },
    contentContainer: {
      backgroundColor: colors.neutral1,
      paddingHorizontal: spacing.padding.small,
      paddingTop: spacing.padding.small,
      paddingBottom: spacing.padding.large,
      borderRadius: spacing.borderRadius.small,
      flex: 1,
    },
    line: {
      height: spacing.margin.base,
      borderRadius: spacing.margin.xTiny,
      width: getRandomInt(80, 120),
      backgroundColor: colors.neutral5,
    },
    firstLine: {
      width: 80,
    },
    secondLine: {
      width: 160,
    },
    avatarHidden: {
      backgroundColor: colors.white,
    },
  });
};
