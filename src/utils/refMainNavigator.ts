import React, {RefObject} from 'react';
import {NavigationContainerRef, StackActions} from '@react-navigation/native';

import {IObject} from '~/interfaces/common';

export const refMainNavigator:
  | RefObject<NavigationContainerRef>
  | null
  | undefined = React.createRef();

export function navigate(name: string, params?: IObject<any>) {
  refMainNavigator?.current?.navigate(name, params);
}

export function replace(name: string, params?: IObject<any>) {
  refMainNavigator?.current?.dispatch(StackActions.replace(name, params));
}

export function nestedNavigate(
  parentName: string,
  name: string,
  params?: IObject<any>,
) {
  refMainNavigator?.current?.navigate(parentName, {
    screen: name,
    params: params,
  });
}
