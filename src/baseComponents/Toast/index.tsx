import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';
import { dimension, spacing } from '~/theme';
import BaseToast from './BaseToast';
import { useKeyboardStatus } from '~/hooks/keyboard';

const Toast = () => {
  const { content, props, duration }: IToastMessage = useKeySelector('modal.toastMessage') || {};
  const {
    buttonText, onButtonPress, onPressClose, ...rest
  } = props || {};
  const durationInSeconds = duration / 1000;
  const [countDown, setCountDown] = useState(durationInSeconds);
  const { height: keyboardHeight } = useKeyboardStatus();

  const dispatch = useDispatch();
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

  if (!content) return null;

  const hideToast = () => dispatch(modalActions.clearToastMessage());

  const _onButtonPress = () => {
    onButtonPress?.();
    hideToast();
  };

  const _onPressClose = () => {
    onPressClose?.();
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
      content={content}
      buttonText={newButtonText}
      onButtonPress={_onButtonPress}
      onPressClose={_onPressClose}
      useI18n
      {...rest}
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
