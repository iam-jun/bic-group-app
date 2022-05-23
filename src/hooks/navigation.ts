import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useEffect} from 'react';
import {DeviceEventEmitter} from 'react-native';

import {NAVIGATION_BACK_PRESSED} from '~/configs/navigator';
import {ITabTypes} from '~/interfaces/IRouter';
import {withNavigation} from '~/router/helper';
import {
  leftNavigationRef,
  rightNavigationRef,
  rootNavigationRef,
} from '~/router/navigator/refs';

export const useRootNavigation = () => {
  const rootNavigation = withNavigation(rootNavigationRef);
  const leftNavigation = withNavigation(leftNavigationRef);
  const rightNavigation = withNavigation(rightNavigationRef);

  return {
    rootNavigation,
    leftNavigation,
    rightNavigation,
  };
};

export const useTabPressListener = (
  callback: (tabName: ITabTypes) => void,
  deps: any[],
) => {
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      'onTabPress',
      (tabName: ITabTypes) => {
        callback?.(tabName);
      },
    );
    return () => {
      listener?.remove?.();
    };
  }, deps);
};

export const useBackPressListener = (callback: () => void) => {
  useFocusEffect(
    useCallback(() => {
      const backEventListener = DeviceEventEmitter.addListener(
        NAVIGATION_BACK_PRESSED,
        callback,
      );

      return () => {
        backEventListener?.remove?.();
      };
    }, []),
  );
};
