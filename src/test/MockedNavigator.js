import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// eslint-disable-next-line react/prop-types
const MockedNavigator = ({ component, params = {} }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="MockedScreen"
        component={component}
        initialParams={params}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default MockedNavigator;
