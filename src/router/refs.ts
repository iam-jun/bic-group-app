import React, { RefObject } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';

export const rootNavigationRef:
  | RefObject<NavigationContainerRef<any>>
  | null
  | undefined = React.createRef();

export const rightNavigationRef:
  | RefObject<NavigationContainerRef<any>>
  | null
  | undefined = React.createRef();
