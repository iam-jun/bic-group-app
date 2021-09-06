import {IconType} from '~/resources/icons';
import React from 'react';

export interface IMenuItemProps {
  label: string;
  routeName: string;
  component: React.ReactNode;
  iconName?: IconType;
}
