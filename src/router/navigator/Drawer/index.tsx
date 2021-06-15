import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {spacing} from '~/theme/configs';
import Icon from '~/theme/components/Icon';
import {mainStack} from '~/configs/navigator';
import BottomTabs from '../BottomTabs';
import DrawerComponent from '~/theme/containers/DrawerComponent';
import {createStackNavigator} from '@react-navigation/stack';
import RootNavigator from '../RootNavigator';
import {ROOT, HOME} from '../routes';

const Drawer = createDrawerNavigator();

export default () => {
  return (
    <Drawer.Navigator
      initialRouteName={mainStack.bottomTabs}
      drawerType="slide"
      drawerPosition="left"
      drawerContent={props => <DrawerComponent />}>
      <Drawer.Screen
        name={HOME}
        component={HomeStack}
        options={({navigation}) => ({
          headerShown: true,
          headerStyle: {paddingHorizontal: spacing.padding.base},
          headerTitleAlign: 'left',
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

const Stack = createStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName={HOME}>
      <Stack.Screen
        name={HOME}
        component={BottomTabs}
        options={{header: () => null}}
      />
      <Stack.Screen
        name={ROOT}
        component={RootNavigator}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
};
