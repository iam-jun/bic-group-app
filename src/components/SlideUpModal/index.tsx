import { ExtendedTheme, useTheme } from '@react-navigation/native';
import React, {
  MutableRefObject, useImperativeHandle,
} from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dimension } from '~/theme';

interface SheetProps {
  sheetRef?: MutableRefObject<any>;
  topOffset?: number;
  minHeight?: number;
  maxHeight?: number;
  expandHeight?: number;
  children: React.ReactElement;

  onOpened?: () => void;
  onClosed?: () => void;
  onExpanded?: () => void;
  onCollapsed?: () => void;
}

type SheetPositions = 'minimised' | 'maximised' | 'expanded';

const SlideUpModal: React.FC<SheetProps> = ({
  sheetRef,
  children,
  topOffset = 0,
  minHeight = 0,
  expandHeight,
  maxHeight: maxHeightProps,

  onOpened,
  onClosed,
  onExpanded,
  onCollapsed,
}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = createStyles(theme);

  // Fixed values (for snap positions)
  const maxHeight = (maxHeightProps || dimension.deviceHeight - insets.top) - topOffset;

  // Animated values
  const position = useSharedValue<SheetPositions>('minimised');
  const modalHeight = useSharedValue(0);

  const springConfig: WithSpringConfig = {
    damping: 50,
    mass: 0.3,
    stiffness: 120,
    overshootClamping: true,
    restSpeedThreshold: 0.3,
    restDisplacementThreshold: 0.3,
  };

  const DRAG_BUFFER = 40;

  const show = () => {
    if (expandHeight) expand();
    else maximise();

    onOpened?.();
  };

  const hide = (urgent?: boolean) => {
    if (urgent) modalHeight.value = 0;
    else modalHeight.value = withSpring(0, springConfig);
    position.value = 'minimised';
    onClosed?.();
  };

  const expand = () => {
    modalHeight.value = withSpring(-expandHeight, springConfig);
    if (position.value === 'maximised') onCollapsed?.();
    else onExpanded?.();

    position.value = 'expanded';
  };

  const maximise = () => {
    modalHeight.value = withSpring(-maxHeight, springConfig);
    position.value = 'maximised';
  };

  useImperativeHandle(
    sheetRef, () => ({
      show,
      hide,
      expand,
      maximise,
      onBackPress: hide,
    }),
  );

  const onGestureEvent = useAnimatedGestureHandler({
    // Set the context value to the sheet's current height value
    onStart: (_ev, ctx: any) => {
      ctx.offsetY = modalHeight.value;
    },
    // Update the sheet's height value based on the gesture
    onActive: (ev, ctx: any) => {
      modalHeight.value = ctx.offsetY + ev.translationY;
    },
    // Snap the sheet to the correct position once the gesture ends
    onEnd: () => {
      // 'worklet' directive is required for animations to work based on shared values
      // Snap to expanded position if the sheet is dragged up from minimised position
      // or dragged down from maximised position

      const hasexpandHeight = expandHeight && expandHeight > minHeight;
      const shouldExpand
        = hasexpandHeight && ((position.value === 'maximised'
          && -modalHeight.value < maxHeight - DRAG_BUFFER)
        || (position.value === 'minimised'
          && -modalHeight.value > minHeight + DRAG_BUFFER));

      // Snap to minimised position if the sheet is dragged down from expanded position
      const positionToMinimise = hasexpandHeight ? 'expanded' : 'maximised';
      const heightToMinimise = hasexpandHeight ? expandHeight : maxHeight;
      const shouldMinimise
        = position.value === positionToMinimise
        && -modalHeight.value < heightToMinimise - DRAG_BUFFER;

      // Snap to maximised position if the sheet is dragged up from expanded position
      const shouldMaximise
        = position.value === 'expanded'
        && -modalHeight.value > expandHeight + DRAG_BUFFER;

      // Update the sheet's position with spring animation
      if (shouldExpand) {
        runOnJS(expand)();
      } else if (shouldMaximise) {
        runOnJS(maximise)();
      } else if (shouldMinimise) {
        runOnJS(hide)();
      } else {
        const newHeight = position.value === 'expanded'
          ? -expandHeight
          : position.value === 'maximised'
            ? -maxHeight
            : -minHeight;

        modalHeight.value = withSpring(
          newHeight, springConfig,
        );
      }
    },
  });

  const sheetHeightAnimatedStyle = useAnimatedStyle(() => ({
    // The 'worklet' directive is included with useAnimatedStyle hook by default
    height: -modalHeight.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[sheetHeightAnimatedStyle, styles.sheet]}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
        >
          <Animated.View
            style={styles.handleContainer}
            hitSlop={{
              top: 10, left: 10, bottom: 10, right: 10,
            }}
          >
            <View style={styles.handle} />
          </Animated.View>
        </PanGestureHandler>
        <SafeAreaView>
          {children}
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const createStyles = (theme: ExtendedTheme) => {
  const { colors, elevations } = theme;
  return StyleSheet.create({
  // The sheet is positioned absolutely to sit at the bottom of the screen
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    sheet: {
      justifyContent: 'flex-start',
      backgroundColor: colors.neutral,
      // Round the top corners
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      minHeight: 80,
      // Add a shadow to the top of the sheet
      ...elevations.e2,
    },
    handleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    // Add a small handle component to indicate the sheet can be dragged
    handle: {
      width: '15%',
      height: 4,
      borderRadius: 8,
      backgroundColor: colors.gray5,
    },
  });
};

export default SlideUpModal;
