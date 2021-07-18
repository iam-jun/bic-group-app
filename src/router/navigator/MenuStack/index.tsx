import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {menuStack} from '~/configs/navigator';
import * as menuStacks from './stack';
import {IObject} from '~/interfaces/common';

const Stack = createStackNavigator();

const GroupStack = () => {
  const Stacks: IObject<any> = menuStacks;
  return (
    <Stack.Navigator headerMode="screen" initialRouteName={menuStack.menu}>
      <Stack.Screen
        name={menuStack.menu}
        component={Stacks[menuStack.menu]}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={menuStack.componentCollection}
        component={Stacks[menuStack.componentCollection]}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default GroupStack;
