import React, {RefObject} from 'react';
import {NavigationContainerRef} from '@react-navigation/native';

export const rootNavigationRef:
  | RefObject<NavigationContainerRef>
  | null
  | undefined = React.createRef();

export const leftNavigationRef:
  | RefObject<NavigationContainerRef>
  | null
  | undefined = React.createRef();

export const rightNavigationRef:
  | RefObject<NavigationContainerRef>
  | null
  | undefined = React.createRef();
