import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import PostDetailScreen from '~/screens/Content/Detail';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}>
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
