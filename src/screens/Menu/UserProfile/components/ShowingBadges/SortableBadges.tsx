import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Gesture, GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue, withTiming,
  runOnJS, useAnimatedStyle, useDerivedValue,
} from 'react-native-reanimated';
// eslint-disable-next-line import/no-extraneous-dependencies
import { between, useVector } from 'react-native-redash';

import { calculateLayout, reorder } from './helper';
import dimension from '~/theme/dimension';

interface DragAndDropOffsets {
  order: Animated.SharedValue<number>;
  initOrder: Animated.SharedValue<number>;
  currentOrder: Animated.SharedValue<number>;
  width: Animated.SharedValue<number>;
  height: Animated.SharedValue<number>;
  x: Animated.SharedValue<number>;
  y: Animated.SharedValue<number>;
  originalX: Animated.SharedValue<number>;
  originalY: Animated.SharedValue<number>;
}

interface SortableBadgesProps {
  children: React.ReactNode;
  index: number;
  gesturesDisabled?: boolean;
  offsets: DragAndDropOffsets[];
  onDragEnd: (startIndex: number, targetIndex: number) => void;
}

const SortableBadges: React.FC<SortableBadgesProps> = ({
  children,
  index,
  gesturesDisabled = false,
  offsets,
  onDragEnd,
}) => {
  const offset = offsets[index];
  const translation = useVector();
  const isGestureActive = useSharedValue(false);
  const panOrderHasChanged = useSharedValue(false);
  const ctxX = useSharedValue(0);
  const ctxY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isGestureActive.value = true;
      translation.x.value = offset.x.value;
      translation.y.value = offset.y.value;
      ctxX.value = translation.x.value;
      ctxY.value = translation.y.value;
    })
    .onChange(({ translationX, translationY }) => {
      translation.x.value = ctxX.value + translationX;
      translation.y.value = ctxY.value + translationY;
      for (let i = 0; i < offsets.length; i++) {
        const o = offsets[i]!;
        if (o.order.value === index) {
          // eslint-disable-next-line no-continue
          continue;
        }
        if (
          between(
            translation.x.value,
            o.x.value,
            o.x.value + o.width.value,
            false,
          )
          && offset.currentOrder.value !== o.currentOrder.value
        ) {
          reorder(offsets, offset.currentOrder.value, o.currentOrder.value);
          calculateLayout(offsets, dimension.deviceWidth);
          panOrderHasChanged.value = true;
          break;
        }
      }
    })
    .onEnd(() => {
      isGestureActive.value = false;
      translation.x.value = offset.x.value;
      translation.y.value = offset.y.value;
      if (panOrderHasChanged.value) {
        runOnJS(onDragEnd)(offset.order.value, offset.currentOrder.value);
      }
      panOrderHasChanged.value = false;
    });

  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value;
    }

    return withTiming(
      offset.x.value,
      { duration: 250 },
    );
  });

  const animatedStyles = useAnimatedStyle(() => ({
    position: 'absolute',
    transform: [
      { translateX: translateX.value },
      { translateY: offset.y.value },
      { scale: withTiming(isGestureActive.value ? 1.2 : 1) },
    ],
    zIndex: isGestureActive.value ? 100 : 0,
  }));

  return (
    <Animated.View style={animatedStyles}>
      {
        gesturesDisabled ? (
          <Animated.View style={StyleSheet.absoluteFill}>
            {children}
          </Animated.View>
        )
          : (
            <GestureDetector gesture={Gesture.Race(panGesture)}>
              <Animated.View style={StyleSheet.absoluteFill}>
                {children}
              </Animated.View>
            </GestureDetector>
          )
      }
    </Animated.View>
  );
};

export default SortableBadges;
