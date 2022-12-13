import { useKeyboard } from '@react-native-community/hooks';
import React, { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const InsetBottomView = () => {
  const insets = useSafeAreaInsets();
  const { keyboardShown } = useKeyboard();
  const defaultPaddingBottom = insets.bottom;
  const showValue = useSharedValue(defaultPaddingBottom);

  useEffect(() => {
    if (keyboardShown) hide();
    else show();
  }, [keyboardShown]);

  const show = () => {
    showValue.value = withTiming(defaultPaddingBottom, undefined);
  };

  const hide = () => {
    showValue.value = withTiming(0, { duration: 100 });
  };

  const bottomViewStyle = useAnimatedStyle(() => ({
    height: showValue.value,
  }));

  return <Animated.View style={bottomViewStyle} />;
};

export default InsetBottomView;
