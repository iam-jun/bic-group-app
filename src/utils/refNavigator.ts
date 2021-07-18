import React, {RefObject} from 'react';
import {NavigationContainerRef, StackActions} from '@react-navigation/native';

import {IObject} from '~/interfaces/common';

export const navigationRef:
  | RefObject<NavigationContainerRef>
  | null
  | undefined = React.createRef();

export const isNavigationRefReady = React.createRef();

export function navigate(name: string, params?: IObject<unknown>): void {
  if (isNavigationRefReady?.current && navigationRef?.current) {
    navigationRef?.current?.navigate(name, params);
  } else {
    setTimeout(() => navigationRef?.current?.navigate(name, params), 100);
  }
}

export function replace(name: string, params?: IObject<unknown>): void {
  if (isNavigationRefReady?.current && navigationRef?.current) {
    navigationRef?.current?.dispatch(StackActions.replace(name, params));
  } else {
    setTimeout(() => navigationRef?.current?.navigate(name, params), 100);
  }
}

export function nestedNavigate(
  parentName: string,
  name: string,
  params?: IObject<unknown>,
): void {
  navigationRef?.current?.navigate(parentName, {
    screen: name,
    params: params,
  });
}
