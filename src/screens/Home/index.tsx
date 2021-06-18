import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import {homeStack} from '~/configs/navigator';
import PostDetailScreen from './components/PostDetailScreen';

const Stack = createStackNavigator();

const Home = () => {
  return (
    <Stack.Navigator initialRouteName={homeStack.home}>
      <Stack.Screen
        name={homeStack.home}
        component={HomeScreen}
        options={{header: () => null}}
      />
      <Stack.Screen
        name={homeStack.postDetail}
        component={PostDetailScreen}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
};

export default Home;
