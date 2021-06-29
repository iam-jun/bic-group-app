import React, {useState} from 'react';
import {Animated, Keyboard, Platform} from 'react-native';

const KeyboardSpacer = ({extraHeight = 0}) => {
  const [height, setHeight] = useState(0);
  const animatedValue = new Animated.Value(0);
  animatedValue.addListener(height => {
    setHeight(height.value);
  });
  const showEvent =
    Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';

  const dismissEvent =
    Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

  React.useEffect(() => {
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
    <Animated.View style={{width: '100%', height: height}}></Animated.View>
  );
};

export default KeyboardSpacer;
