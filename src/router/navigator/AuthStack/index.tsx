import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {AppConfig} from '~/configs';
import {authStack} from '~/configs/navigator';
import {IObject} from '~/interfaces/common';
import * as authStacks from './stack';

const Stack = createStackNavigator();

const AuthStack = () => {
  const Stacks: IObject<any> = authStacks;
  return (
    <Stack.Navigator headerMode="screen" initialRouteName={authStack.landing}>
      <Stack.Screen
        options={AppConfig.defaultScreenOptions}
        name={authStack.landing}
        component={Stacks[authStack.landing]}
      />
      <Stack.Screen
        options={AppConfig.defaultScreenOptions}
        name={authStack.login}
        component={Stacks[authStack.login]}
      />
      <Stack.Screen
        options={AppConfig.defaultScreenOptions}
        name={authStack.signup}
        component={Stacks[authStack.signup]}
      />
      <Stack.Screen
        options={AppConfig.defaultScreenOptions}
        name={authStack.forgotPassword}
        component={Stacks[authStack.forgotPassword]}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
