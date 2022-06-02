import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';

import {AppConfig} from '~/configs';
import {authStack} from '~/configs/navigator';
import {useUserIdAuth} from '~/hooks/auth';
import {IObject} from '~/interfaces/common';
import {initPushTokenMessage} from '~/services/helper';
import * as authStacks from './stack';

const Stack = createStackNavigator();

const AuthStack = () => {
  const Stacks: IObject<any> = authStacks;
  const currentUserId = useUserIdAuth();
  useEffect(() => {
    if (!currentUserId) {
      // make sure delete push token when user logout (when no internet)
      initPushTokenMessage()
        .then(messaging => {
          return messaging().deleteToken();
        })
        .catch(e =>
          console.log('error when delete push token at auth stack', e),
        );
    }
  }, [currentUserId]);
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
