import React from 'react';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import homeStack from './stack';
import screens from './screens';

const HomeStack = (): React.ReactElement => <BaseStackNavigator stack={homeStack} screens={screens} />;

export default HomeStack;
