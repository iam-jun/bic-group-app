import React, {RefObject} from 'react';
import {
  NavigationContainerRef,
  NavigationState,
  PartialState,
  StackActions,
} from '@react-navigation/native';

import {IObject} from '~/interfaces/common';
import {isNumber} from 'lodash';

export const isNavigationRefReady = React.createRef();

export interface Props {
  current?: NavigationContainerRef | null;
  canGoBack: boolean | undefined;
  navigate: (name: string, params?: IObject<unknown>) => void;
  replace: (name: string, params?: IObject<unknown>) => void;
  goBack: () => void;
  popToTop: () => void;
  nestedNavigate: (
    parentName: string,
    name: string,
    params?: IObject<unknown>,
  ) => void;
  setParams: (params: any) => void;
}

export const withNavigation = (
  navigationRef: RefObject<NavigationContainerRef> | null | undefined,
): Props => {
  const canGoBack = navigationRef?.current?.canGoBack();

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
    navigationRef?.current?.canGoBack() && navigationRef?.current?.goBack();
  };

  const popToTop = () => {
    navigationRef?.current?.dispatch(StackActions.popToTop());
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

  const setParams = (params: any) => {
    navigationRef?.current?.setParams(params);
  };

  return {
    current: navigationRef?.current,
    canGoBack,
    navigate,
    replace,
    goBack,
    popToTop,
    nestedNavigate,
    setParams,
  };
};

export const getActiveRouteState = function (
  route?: NavigationState | PartialState<NavigationState>,
): string | null {
  if (!route || !isNumber(route?.index)) return null;

  const currentRoute = route.routes[route.index];
  if (!currentRoute.state) return route.routes[route.index].name;

  const childActiveRoute = route.routes[route.index].state;
  return getActiveRouteState(childActiveRoute);
};
