import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {homeStack} from '~/configs/navigator';
import * as homeStacks from './stack';
import {IObject} from '~/interfaces/common';

const Stack = createStackNavigator();

const HomeStack = () => {
  const Stacks: IObject<any> = homeStacks;
  return (
    <Stack.Navigator headerMode="screen" initialRouteName={homeStack.home}>
      <Stack.Screen
        name={homeStack.home}
        component={Stacks[homeStack.home]}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={homeStack.postDetail}
        component={Stacks[homeStack.postDetail]}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
