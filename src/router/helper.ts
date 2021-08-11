import React, {RefObject} from 'react';
import {NavigationContainerRef, StackActions} from '@react-navigation/native';

import {IObject} from '~/interfaces/common';

export const isNavigationRefReady = React.createRef();

export interface Props {
  navigate: (name: string, params?: IObject<unknown>) => void;
  replace: (name: string, params?: IObject<unknown>) => void;
  goBack: () => void;
  nestedNavigate: (
    parentName: string,
    name: string,
    params?: IObject<unknown>,
  ) => void;
}

export const withNavigation = (
  navigationRef: RefObject<NavigationContainerRef> | null | undefined,
): Props => {
  const navigate = (name: string, params?: IObject<unknown>): void => {
    if (isNavigationRefReady?.current && navigationRef?.current) {
      navigationRef?.current?.navigate(name, params);
    } else {
      setTimeout(() => navigationRef?.current?.navigate(name, params), 100);
    }
  };

  const replace = (name: string, params?: IObject<unknown>): void => {
    if (isNavigationRefReady?.current && navigationRef?.current) {
      navigationRef?.current?.dispatch(StackActions.replace(name, params));
    } else {
      setTimeout(
        () =>
          navigationRef?.current?.dispatch(StackActions.replace(name, params)),
        100,
      );
    }
  };

  const goBack = () => {
    navigationRef?.current?.canGoBack && navigationRef?.current?.goBack();
  };

  const nestedNavigate = (
    parentName: string,
    name: string,
    params?: IObject<unknown>,
  ): void => {
    navigationRef?.current?.navigate(parentName, {
      screen: name,
      params: params,
    });
  };

  return {
    navigate,
    replace,
    goBack,
    nestedNavigate,
  };
};
