import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
export interface Props {
  stack: {[x: string]: string};
  screens: {[x: string]: React.ComponentType<any>};
}

const BaseStackNavigator = ({stack, screens}: Props): React.ReactElement => {
  return (
    <Stack.Navigator headerMode="screen">
      {Object.entries(stack).map(([name, component]) => {
        return (
          <Stack.Screen
            key={'screen' + component}
            name={component}
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

export default BaseStackNavigator;
