import React, {
  FC,
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
  Keyboard,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useKeyboard} from '@react-native-community/hooks';

import {ITheme} from '~/theme/interfaces';

import EmojiBoard from '~/beinComponents/emoji/EmojiBoard';

export interface EmojiBoardAnimatedProps {
  emojiBoardRef?: any;
  style?: StyleProp<ViewStyle>;
  onEmojiSelected: (emoji: string) => void;
}

const EmojiBoardAnimated: FC<EmojiBoardAnimatedProps> = ({
  emojiBoardRef,
  onEmojiSelected,
}: EmojiBoardAnimatedProps) => {
  const [showEmojiBoard, setShowEmojiBoard] = useState(true);
  const [keyboardHeight, setKeyboardHeight] = useState(336);
  const _emojiBoardRef = emojiBoardRef || useRef();

  const visibleAnim = useRef(new Animated.Value(0)).current;

  const theme = useTheme() as ITheme;
  const {dimension} = theme;
  const styles = createStyle(theme);

  const keyboard = useKeyboard();

  useEffect(() => {
    if (keyboard?.keyboardShown) {
      hide();
    }
  }, [keyboard?.keyboardShown]);

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
    Animated.timing(visibleAnim, {
      toValue: keyboardHeight,
      duration: 200,
      delay: 100,
      useNativeDriver: false,
    }).start();
  };

  const hide = () => {
    setShowEmojiBoard(false);
    Animated.timing(visibleAnim, {
      toValue: 0,
      duration: 100,
      delay: 0,
      useNativeDriver: false,
    }).start();
  };

  useImperativeHandle(_emojiBoardRef, () => ({
    show,
    hide,
  }));

  const height = visibleAnim.interpolate({
    inputRange: [0, keyboardHeight],
    outputRange: [0, keyboardHeight],
  });

  if (!showEmojiBoard) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, {height}]}>
      <EmojiBoard
        width={dimension.deviceWidth}
        height={keyboardHeight}
        onEmojiSelected={onEmojiSelected}
      />
    </Animated.View>
  );
};

const createStyle = (theme: ITheme) => {
  const {colors, spacing} = theme;
  return StyleSheet.create({
    container: {
      overflow: 'hidden',
    },
  });
};

export default EmojiBoardAnimated;
