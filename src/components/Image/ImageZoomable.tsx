import React, { FC, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  StyleSheet,
  StyleProp,
  ImageStyle,
  ViewStyle,
  ActivityIndicatorProps,
} from 'react-native';
import {
  GestureHandlerRootView,
  HandlerStateChangeEvent,
  LongPressGestureHandler,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  PinchGestureHandlerGestureEvent,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import ImageWrapper from './ImageWrapper';
import { ImageProps } from '.';

export type ImageZoomableProps = {
  uri?: string;
  maxScale?: number;
  style?: StyleProp<ImageStyle>;
  imageWrapperStyle?: StyleProp<ViewStyle>;
  activityIndicatorProps?: ActivityIndicatorProps;
  renderLoader?: () => void;
  imageProps?: ImageProps;
  onLongPressTap?: () => void;
  onSwipe?: (isFromRightToLeft: boolean) => void;
  isShowLoading?: boolean;
};

const AnimatedImage = Animated.createAnimatedComponent(ImageWrapper);

const ImageZoomable: FC<ImageZoomableProps> = ({
  uri = '',
  maxScale = 3,
  style = {},
  imageWrapperStyle = {},
  activityIndicatorProps = {},
  renderLoader,
  imageProps = {},
  onLongPressTap,
  onSwipe,
  isShowLoading = false,
}) => {
  const panRef = useRef();
  const pinchRef = useRef();

  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    canInteract: false,
    centerX: 0,
    centerY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    imgX: 0,
    imgY: 0,
    imgWidth: 0,
    imgHeight: 0,
  });

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const reset = () => {
    'worklet';

    scale.value = withTiming(1);
    translateX.value = withTiming(state.imgX);
    translateY.value = withTiming(state.imgY);
  };

  const bouncingEdges = () => {
    'worklet';

    if (scale.value > 1) {
      const maxHorizontalPannable
          = (state.imgWidth * scale.value - state.width) / 2;
      const maxVerticlePannable
          = (state.imgHeight * scale.value - state.height) / 2;

      if (Math.abs(translateX.value) > maxHorizontalPannable) {
        if (translateX.value < 0) {
          translateX.value = withTiming(-maxHorizontalPannable);
        }
        if (translateX.value > 0) {
          translateX.value = withTiming(maxHorizontalPannable);
        }
      }

      if (Math.abs(translateY.value) > maxVerticlePannable) {
        if (translateY.value < 0) {
          translateY.value = withTiming(-maxVerticlePannable);
        }
        if (translateY.value > 0) {
          translateY.value = withTiming(maxVerticlePannable);
        }
      }
    }
  };

  const panHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: (_event: PanGestureHandlerEventPayload, context: any) => {
      if (scale.value > 1) {
        context.translateX = translateX.value;
        context.translateY = translateY.value;
      }
    },
    onActive: (event: PanGestureHandlerEventPayload, context: any) => {
      if (scale.value > 1) {
        translateX.value = event.translationX + context.translateX;
        translateY.value = event.translationY + context.translateY;
      }
    },
    onFinish: () => {
      bouncingEdges();
    },
  });

  const pinchHandler
    = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onStart: (event: PinchGestureHandlerEventPayload, context: any) => {
        context.scale = scale.value;
      },
      onActive: (event: PinchGestureHandlerEventPayload, context: any) => {
        scale.value = event.scale + context.scale - 1;
      },
      onFinish: () => {
        if (scale.value <= 1) {
          reset();
        }

        if (scale.value > maxScale) {
          scale.value = withTiming(maxScale);
        }

        bouncingEdges();
      },
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const onLayoutContainer = ({
    nativeEvent: {
      layout: {
        x, y, width, height,
      },
    },
  }: LayoutChangeEvent) => {
    setState((current) => ({
      ...current,
      canInteract: true,
      centerX: x + width / 2,
      centerY: y + height / 2,
      x,
      y,
      width,
      height,
    }));
  };

  const onLayoutImage = ({
    nativeEvent: {
      layout: {
        x, y, width, height,
      },
    },
  }: LayoutChangeEvent) => {
    setState((current) => ({
      ...current,
      imgX: x,
      imgY: y,
      imgWidth: width,
      imgHeight: height,
    }));
  };

  const onImageLoadEnd = () => {
    setIsLoading(false);
  };

  const _onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      if (scale.value > 1) {
        reset();
      }

      if (scale.value === 1) {
        const centerImgX = state.imgX + state.imgWidth / 2;
        const centerImgY = state.imgY + state.imgHeight / 2;
        const newTranslateX
          = (centerImgX - event.nativeEvent.x) * (maxScale - 1);
        const newTranslateY
          = (centerImgY - event.nativeEvent.y) * (maxScale - 1);

        scale.value = withTiming(maxScale);
        translateX.value = withTiming(newTranslateX);
        translateY.value = withTiming(newTranslateY);
      }
    }
  };

  const _onLongPressTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onLongPressTap?.();
    }
  };

  const onPanEnded = (event: HandlerStateChangeEvent) => {
    const { nativeEvent: { translationX } } = event;

    if (scale.value === 1 && Math.abs(translationX as number) > 10) {
      if (translationX as number < 0) {
        onSwipe?.(true);
      }
      if (translationX as number > 0) {
        onSwipe?.(false);
      }
    }
  };

  return (
    <GestureHandlerRootView onLayout={onLayoutContainer} style={{ flex: 1 }}>
      <PinchGestureHandler
        ref={pinchRef}
        onGestureEvent={pinchHandler}
        enabled={state.canInteract}
      >
        <Animated.View style={[styles.container]}>
          <PanGestureHandler
            ref={panRef}
            onGestureEvent={panHandler}
            minPointers={1}
            maxPointers={1}
            onEnded={onPanEnded}
            enabled={state.canInteract}
          >
            <Animated.View style={[styles.content, imageWrapperStyle]}>
              <TapGestureHandler
                numberOfTaps={2}
                onHandlerStateChange={_onDoubleTap}
                enabled={state.canInteract}
              >
                <LongPressGestureHandler onHandlerStateChange={_onLongPressTap} enabled={state.canInteract}>
                  <Animated.View style={styles.container}>
                    <AnimatedImage
                      style={[styles.container, style as any, animatedStyle]}
                      source={{ uri }}
                      resizeMode="contain"
                      onLoadEnd={onImageLoadEnd}
                      onLayout={onLayoutImage}
                      {...imageProps}
                    />
                  </Animated.View>
                </LongPressGestureHandler>
              </TapGestureHandler>
              {isShowLoading && (isLoading
                && (renderLoader ? (
                  renderLoader()
                ) : (
                  <ActivityIndicator
                    size="small"
                    style={styles.loader}
                    color="dimgrey"
                    {...activityIndicatorProps}
                  />
                )))}
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    // flexGrow: 1,
    // position: 'relative',
    overflow: 'hidden',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'whitesmoke',
  },
});

export default ImageZoomable;
