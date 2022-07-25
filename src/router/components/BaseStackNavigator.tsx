import React from 'react';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export interface Props {
  stack: {[x: string]: string};
  screens: {[x: string]: React.ComponentType<any>};
  initialRouteName?: string;
}

const BaseStackNavigator = ({
  stack,
  screens,
  initialRouteName,
}: Props): React.ReactElement => {
  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      {Object.entries(stack).map(([name, component]) => {
        return (
          <Stack.Screen
            key={'screen' + component}
            name={component}
            component={screens[component]}
            options={{
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
