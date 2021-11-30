import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Platform} from 'react-native';

import BannerMessage from './BannerMessage';

const InternetConnectionStatus = ({
  isInternetReachable,
}: {
  isInternetReachable: boolean | null;
}) => {
  const styles = createStyle();
  const firstRender = useRef(true);

  const [showBanner, setShowBanner] = useState<boolean>(false);
  const timeoutRef = useRef<any>();

  useEffect(() => {
    // avoid rendering when initializing the app/component
    if (!firstRender.current) {
      setShowBanner(true);
      if (isInternetReachable) {
        timeoutRef.current && clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setShowBanner(false);
        }, 2000);
      }
    }

    if (firstRender.current && isInternetReachable !== null) {
      // when initializing the app/component, the variable `isInternetReachable`
      // is set to null, then changes to true/false.
      // So this will avoid unwanted render at first.
      firstRender.current = false;
    }
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
