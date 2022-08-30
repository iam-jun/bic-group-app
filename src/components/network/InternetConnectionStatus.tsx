import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExtendedTheme, useTheme } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { useKeySelector } from '~/hooks/selector';
import dimension from '~/theme/dimension';
import BaseToast from '~/baseComponents/Toast/BaseToast';
import { spacing } from '~/theme';
import noInternetActions from '~/storeRedux/network/actions';

const InternetConnectionStatus = () => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const theme = useTheme() as ExtendedTheme;
  const { colors } = theme;
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

  return isInternetReachable ? (
    <BaseToast
      style={styles.toast}
      content="internet_connection:online"
      icon="WifiSolid"
      iconColor={colors.green50}
      useI18n
      onPressClose={hideToast}
    />
  ) : (
    <BaseToast
      style={styles.toast}
      content="internet_connection:offline"
      icon="WifiSlashSolid"
      iconColor={colors.neutral20}
      buttonText="common:text_refresh"
      useI18n
      onPressClose={hideToast}
      onButtonPress={checkInternetReacble}
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
