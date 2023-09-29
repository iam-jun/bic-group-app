import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const useInsetBottomAvoidingKeyboard = () => {
  const insets = useSafeAreaInsets();
  const [bottom, setBottom] = useState(insets.bottom);

  const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
  const dismissEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

  useEffect(
    () => {
      const keyboardShowListener = Keyboard.addListener(
        showEvent, () => {
          setBottom(0);
        },
      );
      const keyboardHideListener = Keyboard.addListener(
        dismissEvent,
        () => {
          setBottom(insets.bottom);
        },
      );

      return () => {
        keyboardHideListener.remove();
        keyboardShowListener.remove();
      };
    }, [],
  );

  return bottom;
};

export default useInsetBottomAvoidingKeyboard;
