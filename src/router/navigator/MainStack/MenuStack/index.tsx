import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {menuStack, screens} from './stack';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator headerMode="screen" initialRouteName={menuStack.menu}>
      {Object.entries(menuStack).map(([name, component]) => {
        return (
          <Stack.Screen
            key={'screen' + component}
            name={component}
            //@ts-ignore
            component={screens[component]}
            options={{
              animationEnabled: true,
              headerShown: false,
              title: name,
            }}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export default HomeStack;
