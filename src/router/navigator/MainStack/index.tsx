import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { mainStack } from "~/configs/navigator";

import Drawer from "../Drawer";

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={mainStack.bottomTabs}
      headerMode="screen"
    >
      <Stack.Screen
        name={mainStack.drawer}
        component={Drawer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
