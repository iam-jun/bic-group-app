import {useKeyboard} from '@react-native-community/hooks';
import React, {useEffect, useImperativeHandle, useRef, useState} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  FlingGestureHandlerStateChangeEvent,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {useTheme} from 'react-native-paper';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {dimension} from '~/theme';
import {ITheme} from '~/theme/interfaces';
import {EmojiBoardProps} from '../emoji/EmojiBoard';
import GiphyView from './GiphyView';

export interface Props extends Partial<EmojiBoardProps> {
  stickerViewRef?: any;
}

const StickerView: React.FC<Props> = ({stickerViewRef}: Props) => {
  const [showEmojiBoard, setShowEmojiBoard] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(336);
  const _emojiBoardRef = stickerViewRef || useRef();

  //   const visibleAnim = useRef(new Animated.Value(0)).current;
  const height = useSharedValue(0);

  const theme = useTheme() as ITheme;
  const styles = createStyle(theme);

  const keyboard = useKeyboard();
  const yValue = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => {
    const caculateHeight = interpolate(
      height.value,
      [0, -keyboardHeight],
      [0, -keyboardHeight],
    );
    return {
      height: caculateHeight,
    };
  });

  useEffect(() => {
    if (
      keyboard?.keyboardHeight &&
      keyboardHeight !== keyboard?.keyboardHeight
    ) {
      setKeyboardHeight(keyboard?.keyboardHeight);
    }
  }, [keyboard?.keyboardHeight]);

  const show = () => {
    setShowEmojiBoard(true);
    Keyboard.dismiss();
    height.value = withTiming(keyboardHeight, {duration: 200});
  };

  const expand = () => {
    height.value = withTiming(dimension.deviceHeight - 100, {duration: 200});
    setIsExpanded(true);
  };

  const colapse = () => {
    height.value = withTiming(keyboardHeight, {duration: 200});
    setIsExpanded(false);
  };

  const hide = () => {
    const onHideDone = () => {
      setShowEmojiBoard(false);
    };
    height.value = withTiming(0, {duration: 200}, () => {
      runOnJS(onHideDone)();
    });
  };

  useImperativeHandle(_emojiBoardRef, () => ({
    show,
    hide,
  }));

  const onDownFlingHandlerStateChange = ({
    nativeEvent,
  }: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      if (isExpanded) runOnJS(colapse)();
      else runOnJS(hide)();
    }
  };

  const onUpFlingHandlerStateChange = ({
    nativeEvent,
  }: FlingGestureHandlerStateChangeEvent) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      if (height.value <= keyboardHeight) runOnJS(expand)();
    }
  };

  return (
    <FlingGestureHandler
      onHandlerStateChange={onUpFlingHandlerStateChange}
      direction={Directions.UP}>
      <FlingGestureHandler
        direction={Directions.DOWN}
        onHandlerStateChange={onDownFlingHandlerStateChange}>
        <Animated.View
          style={[
            styles.container,
            containerStyle,
            isExpanded && styles.expanded,
          ]}>
          <GiphyView />
        </Animated.View>
      </FlingGestureHandler>
    </FlingGestureHandler>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      borderTopWidth: 1,
      borderTopColor: colors.borderDivider,
      backgroundColor: colors.background,
      paddingTop: spacing.padding.base,
    },
    expanded: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
};

export default StickerView;
