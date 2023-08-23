import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSkeletonAnimation } from '~/hooks/useSkeletonAnimation';
import { spacing } from '~/theme';

const SettingItemSkeleton = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const animatedStyle = useSkeletonAnimation({ targetOpacityValue: 0.5, speed: 500 });

  return (
    <View style={[styles.container, styles.row]}>
      <Animated.View style={[styles.line, styles.icon, animatedStyle]} />
      <Animated.View style={[styles.line, styles.text, animatedStyle]} />
      <Animated.View style={[styles.line, styles.shortLine, animatedStyle]} />
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      backgroundColor: colors.white,
      width: '100%',
      padding: spacing.padding.large,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 24,
    },
    text: {
      width: 100,
    },
    line: {
      height: 22,
      width: '100%',
      backgroundColor: colors.neutral5,
    },
    shortLine: {
      width: 40,
    },
  });
};

export default SettingItemSkeleton;
