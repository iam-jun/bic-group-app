import React from 'react';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import screens from './screens';
import stack from './stack';

const MenuStack = (): React.ReactElement => <BaseStackNavigator stack={stack} screens={screens} />;

export default MenuStack;
