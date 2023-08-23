import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  View, StyleSheet, ViewStyle, StyleProp,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, cancelAnimation,
} from 'react-native-reanimated';
import spacing, { borderRadius } from '~/theme/spacing';

interface CircleSpinnerProps {
  size: number;
}

const CircleSpinner = ({ size }: CircleSpinnerProps) => {
  const theme: ExtendedTheme = useTheme();
  const styles = createStyles(theme);

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
    );
    return () => cancelAnimation(rotation);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  const circleStyle: StyleProp<ViewStyle> = {
    width: size,
    height: size,
  };

  return (
    <View testID="circle_spinner" style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle, circleStyle]} />
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      height: 24,
      width: 24,
      borderRadius: borderRadius.circle,
      borderWidth: spacing.margin.xTiny,
      borderTopColor: colors.gray5,
      borderRightColor: colors.gray5,
      borderBottomColor: colors.gray5,
      borderLeftColor: colors.purple50,
    },
  });
};

export default CircleSpinner;
