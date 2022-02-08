import React from 'react';
import BaseDrawerNavigator from '~/router/components/BaseDrawerNavigator';
import screens from './screens';
import stack from './stack';
import {Platform} from 'react-native';

const MenuStack = () => {
  return (
    <BaseDrawerNavigator
      stack={stack}
      screens={screens}
      initialRouteName={Platform.OS === 'web' ? undefined : 'drawer-menu'}
    />
  );
};

export default MenuStack;
