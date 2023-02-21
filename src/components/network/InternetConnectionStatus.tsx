import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useNetworkStore from '~/store/network';
import networkSelectors from '~/store/network/selectors';
import dimension from '~/theme/dimension';
import BaseToast, { BaseToastProps, ToastType } from '~/baseComponents/Toast/BaseToast';
import { spacing } from '~/theme';

const InternetConnectionStatus = () => {
  const isInternetReachable = useNetworkStore(networkSelectors.getIsInternetReachable);
  const networkActions = useNetworkStore((state) => state.actions);

  const styles = createStyle();
  const firstRender = useRef(true);

  const [showToast, setShowToast] = useState<boolean>(false);
  const timeoutRef = useRef<any>();

  const hideToast = () => setShowToast(false);

  const checkInternetReachable = () => {
    networkActions.checkIsInternetReachable();
  };

  const doShowToast = () => {
    setShowToast(true);
    if (isInternetReachable) {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(hideToast, 4000);
    }
  };

  useEffect(
    () => {
      if (firstRender.current) {
        if (!isInternetReachable) doShowToast();

        firstRender.current = false;
        return;
      }

      doShowToast();
    }, [isInternetReachable],
  );

  useEffect(
    () => () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    }, [],
  );

  if (!showToast) return null;

  const toastProps: BaseToastProps = isInternetReachable ? {
    type: ToastType.SUCCESS,
    content: 'internet_connection:online',
    icon: 'WifiSolid',
  } : {
    type: ToastType.NEUTRAL,
    content: 'internet_connection:offline',
    icon: 'WifiSlashSolid',
    buttonText: 'common:text_refresh',
    onButtonPress: checkInternetReachable,
  };

  return (
    <BaseToast
      style={styles.toast}
      onClose={hideToast}
      {...toastProps}
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

export default InternetConnectionStatus;
