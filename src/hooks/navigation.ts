import {withNavigation} from '~/router/helper';
import {
  leftNavigationRef,
  rightNavigationRef,
  rootNavigationRef,
} from '~/router/navigator/refs';
import {useEffect} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {ITabTypes} from '~/interfaces/IRouter';

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
