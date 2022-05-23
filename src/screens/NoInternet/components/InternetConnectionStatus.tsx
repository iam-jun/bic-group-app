import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Platform} from 'react-native';
import {useKeySelector} from '~/hooks/selector';

import BannerMessage from '~/beinComponents/ToastMessage/BannerMessage';

const InternetConnectionStatus = () => {
  const isInternetReachable = useKeySelector('noInternet.isInternetReachable');

  const styles = createStyle();
  const firstRender = useRef(true);

  const [showBanner, setShowBanner] = useState<boolean>(false);
  const timeoutRef = useRef<any>();

  const doShowBanner = () => {
    setShowBanner(true);
    if (isInternetReachable) {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowBanner(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (firstRender.current) {
      if (!isInternetReachable) doShowBanner();

      firstRender.current = false;
      return;
    }

    doShowBanner();
  }, [isInternetReachable]);

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!showBanner) return null;

  return isInternetReachable ? (
    <BannerMessage
      style={styles.banner}
      type={'success'}
      leftIcon={'Check'}
      textProps={{useI18n: true}}>
      internet_connection:online
    </BannerMessage>
  ) : (
    <BannerMessage
      style={styles.banner}
      leftIcon={'WifiSlash'}
      textProps={{useI18n: true}}>
      internet_connection:offline
    </BannerMessage>
  );
};

const createStyle = () => {
  return StyleSheet.create({
    banner: {
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
};

export default InternetConnectionStatus;
