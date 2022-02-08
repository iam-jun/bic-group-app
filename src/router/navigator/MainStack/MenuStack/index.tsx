import React from 'react';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import screens from './screens';
import stack from './stack';
import {Platform} from 'react-native';

const MenuStack = () => {
  return (
    <BaseStackNavigator
      stack={stack}
      screens={screens}
      initialRouteName={Platform.OS === 'web' ? undefined : 'drawer-menu'}
    />
  );
};

export default MenuStack;
