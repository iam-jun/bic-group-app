import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/storeRedux/modal/actions';
import { dimension, spacing } from '~/theme';
import BaseToast from './BaseToast';

const Toast = () => {
  const { content, props, duration }: IToastMessage = useKeySelector('modal.toastMessage') || {};
  const {
    buttonText, onButtonPress, onPressClose, ...rest
  } = props || {};
  const durationInSeconds = duration / 1000;
  const [countDown, setCountDown] = useState(durationInSeconds);

  const dispatch = useDispatch();
  const styles = createStyle();

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
      newButtonText = `${buttonText} (${countDown})`;
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

const createStyle = () => {
  const insets = useSafeAreaInsets();

  return StyleSheet.create({
    toast: {
      position: 'absolute',
      bottom: dimension.bottomBarHeight + insets.bottom + spacing.margin.extraLarge,
    },
  });
};

export default Toast;
