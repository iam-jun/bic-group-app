import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppConfig } from '~/configs';
import { useUserIdAuth } from '~/hooks/auth';
import { initPushTokenMessage } from '~/services/firebase';
import authScreens from '~/router/navigator/AuthStack/screens';
import authStacks from '~/router/navigator/AuthStack/stack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const currentUserId = useUserIdAuth();
  useEffect(
    () => {
      if (!currentUserId) {
      // make sure delete push token when user logout (when no internet)
        initPushTokenMessage()
          .then((messaging) => messaging().deleteToken())
          .catch((e) => console.error(
            'error when delete push token at auth stack', e,
          ));
      }
    }, [currentUserId],
  );
  return (
    <Stack.Navigator initialRouteName={authStacks.signIn}>
      {Object.entries(authScreens).map(([name, component]) => (
        <Stack.Screen
          key={`screen${component}`}
          options={AppConfig.defaultScreenOptions}
          name={name}
          component={component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default AuthStack;
