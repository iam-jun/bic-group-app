import React, { FC } from 'react';
import {
  StyleSheet, StyleProp, ViewStyle, View,
} from 'react-native';
import { ExtendedTheme, useTheme } from '@react-navigation/native';

import Animated from 'react-native-reanimated';
import dimension from '~/theme/dimension';

import spacing from '~/theme/spacing';
import { useSkeletonAnimation } from '~/hooks/useSkeletonAnimation';
import ViewSpacing from '../ViewSpacing';

export interface CreatePostHeaderPlaceholderProps {
  style?: StyleProp<ViewStyle>;
}

const HeaderCreatePostPlaceholder: FC<CreatePostHeaderPlaceholderProps> = ({
  style,
}: CreatePostHeaderPlaceholderProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const animatedStyle = useSkeletonAnimation({ targetOpacityValue: 0.5, speed: 500 });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.line, styles.left, animatedStyle]} />
      <ViewSpacing width={spacing.margin.small} />
      <Animated.View style={[styles.line, styles.content, animatedStyle]} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing?.padding.base,
      paddingHorizontal: spacing?.padding.large,
      backgroundColor: colors.white,
    },
    left: {
      width: dimension.avatarSizes.medium,
      height: dimension.avatarSizes.medium,
      borderRadius: 50,
      backgroundColor: colors.neutral5,
    },
    content: {
      width: '100%',
      height: 40,
      borderRadius: 100,
      flex: 1,
    },
    line: {
      borderRadius: spacing.margin.tiny,
      backgroundColor: colors.neutral5,
      marginVertical: spacing.margin.tiny,
    },
  });
};

export default HeaderCreatePostPlaceholder;
