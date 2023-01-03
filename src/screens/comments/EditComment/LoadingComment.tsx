import React from 'react';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSkeletonAnimation } from '~/hooks/useSkeletonAnimation';
import { spacing } from '~/theme';

const LoadingComment = () => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyle(theme);
  const animatedStyle = useSkeletonAnimation({ targetOpacityValue: 0.5, speed: 500 });

  return (
    <View style={styles.container}>
      <View style={styles.text}>
        <Animated.View style={[styles.line, animatedStyle]} />
        <Animated.View style={[styles.line, animatedStyle]} />
        <Animated.View style={[styles.line, styles.shortLine, animatedStyle]} />
      </View>
      <View style={styles.row}>
        <Animated.View style={[styles.button, animatedStyle]} />
        <Animated.View style={[styles.button, animatedStyle]} />
        <Animated.View style={[styles.button, animatedStyle]} />
      </View>
    </View>
  );
};

const createStyle = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      zIndex: 5,
      position: 'absolute',
      backgroundColor: colors.white,
      bottom: 0,
      right: 0,
      top: 0,
      width: '100%',
    },
    text: {
      padding: spacing.padding.large,
    },
    line: {
      height: 20,
      width: '100%',
      marginVertical: spacing.margin.tiny,
      backgroundColor: colors.neutral5,
    },
    shortLine: {
      width: '70%',
    },
    row: {
      height: 56,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.padding.large,
      backgroundColor: colors.white,
      borderTopWidth: 1,
      borderColor: colors.neutral5,
    },
    button: {
      height: 20,
      width: 20,
      marginHorizontal: spacing.margin.xSmall,
      backgroundColor: colors.neutral5,
    },
  });
};

export default LoadingComment;
