import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { spacing } from "~/theme/configs";
import Icon from "~/theme/components/Icon";
import Home from "~/screens/Home";

const Drawer = createDrawerNavigator();

export default () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerType="slide"
      drawerPosition="left"
      overlayColor="transparent"
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={({ navigation }) => ({
          headerShown: true,
          headerStyle: { paddingHorizontal: spacing.padding.base },
          headerTitleAlign: "left",
          headerLeft: () => (
            <Icon
              size={22}
              icon="iconMenu"
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
};
