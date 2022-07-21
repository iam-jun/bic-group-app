import React from 'react';
import { IconType } from '~/resources/icons';

export interface IMenuItemProps {
  label: string;
  routeName: string;
  component: React.ReactNode;
  iconName?: IconType;
}
