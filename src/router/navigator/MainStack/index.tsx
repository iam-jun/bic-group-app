import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {mainStack} from '~/configs/navigator';

import BottomTabs from '../BottomTabs';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={mainStack.bottomTabs}
      headerMode="screen">
      <Stack.Screen
        name={mainStack.bottomTabs}
        component={BottomTabs}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
