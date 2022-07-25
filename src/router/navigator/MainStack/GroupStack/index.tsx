import React from 'react';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';
import stack from './stack';
import screens from './screens';

const GroupStack = (): React.ReactElement => <BaseStackNavigator stack={stack} screens={screens} />;

export default GroupStack;
