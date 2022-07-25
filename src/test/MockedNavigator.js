import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

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
