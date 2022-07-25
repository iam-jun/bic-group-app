import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();
export interface Props {
  stack: {[x: string]: string};
  screens: {[x: string]: React.ComponentType<any>};
  initialRouteName?: string;
}

const BaseStackNavigator = ({
  stack,
  screens,
  initialRouteName,
}: Props): React.ReactElement => (
  <Stack.Navigator headerMode="screen" initialRouteName={initialRouteName}>
    {Object.entries(stack).map(([name, component]) => (
      <Stack.Screen
        key={`screen${component}`}
        name={component} // TODO: refactor
        component={screens[component]}
        options={{
          // animationEnabled: true,
          headerShown: false,
          title: name,
        }}
      />
    ))}
  </Stack.Navigator>
);

export default BaseStackNavigator;
