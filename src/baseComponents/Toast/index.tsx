import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useModalStore from '~/store/modal';
import { dimension, spacing } from '~/theme';
import BaseToast from './BaseToast';
import { useKeyboardStatus } from '~/hooks/keyboard';

const Toast = () => {
  const {
    duration, buttonText, onButtonPress, onClose, ...props
  } = useModalStore((state) => state.toast) || {};
  const { clearToast } = useModalStore((state) => state.actions);
  const durationInSeconds = duration / 1000;
  const [countDown, setCountDown] = useState(durationInSeconds);
  const { height: keyboardHeight } = useKeyboardStatus();

  const styles = createStyle(keyboardHeight);

  useEffect(() => {
    setCountDown(durationInSeconds);

    const interval = setInterval(() => {
      setCountDown((countDown) => countDown - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [duration]);

  const hideToast = () => clearToast();

  const _onButtonPress = () => {
    onButtonPress?.();
    hideToast();
  };

  const _onClose = () => {
    onClose?.();
    hideToast();
  };

  let newButtonText: string;
  if (buttonText) {
    newButtonText = buttonText;
    if (duration && countDown) {
      newButtonText = `${buttonText} (${countDown}s)`;
    }
  }

  return (
    <BaseToast
      style={styles.toast}
      buttonText={newButtonText}
      onButtonPress={_onButtonPress}
      onClose={_onClose}
      {...props}
    />
  );
};

const createStyle = (keyboardHeight: number) => {
  const insets = useSafeAreaInsets();
  let toastBottom = dimension.bottomBarHeight + insets.bottom + spacing.margin.extraLarge;
  if (keyboardHeight) toastBottom = insets.bottom + spacing.margin.extraLarge + (Platform.OS === 'ios' ? keyboardHeight : 0);
  return StyleSheet.create({
    toast: {
      position: 'absolute',
      bottom: toastBottom,
    },
  });
};

export default Toast;
