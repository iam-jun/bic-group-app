import { useEffect, useRef, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

export function useKeyboardStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const keyboardShowListener = useRef(null);
  const keyboardHideListener = useRef(null);

  const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';

  const dismissEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';

  useEffect(() => {
    keyboardShowListener.current = Keyboard.addListener(
      showEvent, (e: any) => {
        setHeight(e.endCoordinates?.height);
        setIsOpen(true);
      },
    );
    keyboardHideListener.current = Keyboard.addListener(
      dismissEvent, () => {
        setHeight(0);
        setIsOpen(false);
      },
    );

    return () => {
      keyboardShowListener.current.remove();
      keyboardHideListener.current.remove();
    };
  });

  return { isOpen, height };
}
