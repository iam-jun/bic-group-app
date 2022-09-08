import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import dimension from '~/theme/dimension';
import BaseToast, { BaseToastProps } from '~/baseComponents/Toast/BaseToast';
import { spacing } from '~/theme';
import noInternetActions from '~/storeRedux/network/actions';

const InternetConnectionStatus = () => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const styles = createStyle();
  const firstRender = useRef(true);
  const dispatch = useDispatch();

  const [showToast, setShowToast] = useState<boolean>(false);
  const timeoutRef = useRef<any>();

  const hideToast = () => setShowToast(false);

  const checkInternetReacble = () => {
    dispatch(noInternetActions.checkInternetReachable());
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
    type: 'success',
    content: 'internet_connection:online',
    icon: 'WifiSolid',
  } : {
    type: 'neutral',
    content: 'internet_connection:offline',
    icon: 'WifiSlashSolid',
    buttonText: 'common:text_refresh',
    onButtonPress: checkInternetReacble,
  };

  return (
    <BaseToast
      useI18n
      style={styles.toast}
      onPressClose={hideToast}
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
