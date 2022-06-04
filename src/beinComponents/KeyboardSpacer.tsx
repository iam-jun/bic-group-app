import React, {useState, useEffect, FC} from 'react';
import {Animated, Keyboard, Platform} from 'react-native';

export interface KeyboardSpacerProps {
  testID?: string;
  iosOnly?: boolean;
  extraHeight?: number;
}

const KeyboardSpacer: FC<KeyboardSpacerProps> = ({
  testID,
  extraHeight = 0,
  iosOnly,
}: KeyboardSpacerProps) => {
  if (iosOnly && Platform.OS !== 'ios') {
    return null;
  }

  const [height, setHeight] = useState(0);
  const animatedValue = new Animated.Value(0);
  animatedValue.addListener(height => {
    setHeight(height.value);
  });
  const showEvent =
    Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';

  const dismissEvent =
    Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(showEvent, event => {
      if (event.endCoordinates?.height)
        Animated.timing(animatedValue, {
          toValue: event.endCoordinates.height + extraHeight,
          useNativeDriver: false,
          duration: 250,
        }).start();
    });
    const keyboardWillHideListener = Keyboard.addListener(
      dismissEvent,
      event => {
        Animated.timing(animatedValue, {
          toValue: 0,
          useNativeDriver: false,
          duration: 250,
        }).start();
      },
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);
  return (
    <Animated.View testID={testID} style={{width: '100%', height: height}} />
  );
};

export default KeyboardSpacer;
