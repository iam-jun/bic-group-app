import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { DeviceEventEmitter } from 'react-native';

import { NAVIGATION_BACK_PRESSED } from '~/configs/navigator';
import { ITabTypes } from '~/interfaces/IRouter';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';

export const useRootNavigation = () => {
  const rootNavigation = withNavigation(rootNavigationRef);

  return {
    rootNavigation,
  };
};

export const useTabPressListener = (
  callback: (tabName: ITabTypes) => void,
  deps: any[],
) => {
  useEffect(
    () => {
      const listener = DeviceEventEmitter.addListener(
        'onTabPress',
        (tabName: ITabTypes) => {
          callback?.(tabName);
        },
      );
      return () => {
        listener?.remove?.();
      };
    }, deps,
  );
};
/**
 * SHOULD ADD SCREEN TO `customBackHandlerRoutes` FOR USE THIS HOOK
 * @param callback
 */
export const useBackPressListener = (callback: () => void) => {
  useFocusEffect(useCallback(
    () => {
      const backEventListener = DeviceEventEmitter.addListener(
        NAVIGATION_BACK_PRESSED,
        callback,
      );

      return () => {
        backEventListener?.remove?.();
      };
    }, [callback],
  ));
};
