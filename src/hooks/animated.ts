import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useAnimatedValue = (
  startDelay: number,
  start: number,
  end: number,
  duration: number,
) => {
  const animatedValue = useRef(new Animated.Value(start)).current;

  const _animated = () => {
    Animated.sequence([
      Animated.timing(
        animatedValue, {
          toValue: end,
          duration,
          useNativeDriver: false,
        },
      ),
    ]).start();
  };

  useEffect(
    () => {
      const _animate = setTimeout(
        () => _animated(), startDelay,
      );

      return () => clearTimeout(_animate);
    }, [_animated, startDelay],
  );

  return animatedValue;
};
