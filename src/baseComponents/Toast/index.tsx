import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeySelector } from '~/hooks/selector';
import { dimension, spacing } from '~/theme';
import BaseToast from './BaseToast';

const Toast = () => {
  const toastMessage: any = useKeySelector('modal.toastMessage') || {};
  const styles = createStyle();

  if (!toastMessage?.content) return null;

  return (
    <BaseToast
      style={styles.toast}
      content={toastMessage?.content}
      useI18n
      {...toastMessage?.props}
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
