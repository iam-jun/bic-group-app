import React, {RefObject} from 'react';
import {NavigationContainerRef, StackActions} from '@react-navigation/native';

import {IObject} from '~/interfaces/common';

export const navigationRef:
  | RefObject<NavigationContainerRef>
  | null
  | undefined = React.createRef();

export function navigate(name: string, params?: IObject<any>) {
  navigationRef?.current?.navigate(name, params);
}

export function replace(name: string, params?: IObject<any>) {
  navigationRef?.current?.dispatch(StackActions.replace(name, params));
}

export function nestedNavigate(
  parentName: string,
  name: string,
  params?: IObject<any>,
) {
  navigationRef?.current?.navigate(parentName, {
    screen: name,
    params: params,
  });
}
