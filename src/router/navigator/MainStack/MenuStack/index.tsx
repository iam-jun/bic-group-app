import React from 'react';
import BaseDrawerNavigator from '~/router/components/BaseDrawerNavigator';
import screens from './screens';
import stack from './stack';

const MenuStack = () => {
  return <BaseDrawerNavigator stack={stack} screens={screens} />;
};

export default MenuStack;
