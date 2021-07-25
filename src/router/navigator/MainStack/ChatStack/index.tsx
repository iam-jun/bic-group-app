import React from 'react';
import stack from './stack';
import screens from './screens';
import BaseStackNavigator from '~/router/components/BaseStackNavigator';

const ChatStack = (): React.ReactElement => {
  return <BaseStackNavigator stack={stack} screens={screens} />;
};

export default ChatStack;
