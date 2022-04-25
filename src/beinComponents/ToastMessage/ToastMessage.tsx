import React from 'react';
import {StyleSheet, Platform} from 'react-native';

import {useKeySelector} from '~/hooks/selector';
import BannerMessage from './BannerMessage';
import NormalToastMessage from './NormalToastMessage';
import SimpleToastMessage from './SimpleToastMessage';

const ToastMessage = () => {
  const toastMessage: any = useKeySelector('modal.toastMessage') || {};

  if (!toastMessage?.content) return null;

  const {style = {}, ...restProps} = toastMessage?.props || {};

  let ToastMessageComponent;

  if (toastMessage?.toastType) {
    if (toastMessage.toastType === 'normal') {
      ToastMessageComponent = NormalToastMessage;
    } else if (toastMessage.toastType === 'banner') {
      ToastMessageComponent = BannerMessage;
    } else ToastMessageComponent = SimpleToastMessage;

    return (
      <ToastMessageComponent style={[styles.toastStyle, style]} {...restProps}>
        {toastMessage?.content}
      </ToastMessageComponent>
    );
  }

  if (Platform.OS === 'web') ToastMessageComponent = NormalToastMessage;
  else ToastMessageComponent = SimpleToastMessage;

  return (
    <ToastMessageComponent style={[styles.toastStyle, style]} {...restProps}>
      {toastMessage?.content}
    </ToastMessageComponent>
  );
};

const styles = StyleSheet.create({
  toastStyle: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    marginHorizontal: 12,
    marginBottom: 4,
    ...Platform.select({
      web: {
        left: 40,
        bottom: 40,
        alignSelf: undefined,
        marginHorizontal: undefined,
        marginBottom: undefined,
      },
    }),
  },
});

export default ToastMessage;
