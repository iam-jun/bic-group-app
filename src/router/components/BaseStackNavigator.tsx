/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

//@ts-ignore
// eslint-disable-next-line react/prop-types
const GroupStack = ({stack, screens}): React.ReactElement => {
  return (
    <Stack.Navigator headerMode="screen">
      {Object.entries(stack).map(([name, component]) => {
        return (
          <Stack.Screen
            key={'screen' + component}
            //@ts-ignore
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

export default GroupStack;
