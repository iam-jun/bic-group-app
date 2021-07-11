import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {authStack} from '~/configs/navigator';
import * as authStacks from './stack';
import {IObject} from '~/interfaces/common';

const Stack = createStackNavigator();

const AuthStack = () => {
  const Stacks: IObject<any> = authStacks;
  return (
    <Stack.Navigator headerMode="screen" initialRouteName={authStack.login}>
      <Stack.Screen
        options={{headerShown: false}}
        name={authStack.login}
        component={Stacks[authStack.login]}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={authStack.signup}
        component={Stacks[authStack.signup]}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name={authStack.forgotPassword}
        component={Stacks[authStack.forgotPassword]}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
