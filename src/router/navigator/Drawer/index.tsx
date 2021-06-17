import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {spacing} from '~/theme/configs';
import Icon from '~/theme/components/Icon';
import Home from '~/screens/Home';
import {mainStack} from '~/configs/navigator';
import BottomTabs from '../BottomTabs';
import DrawerComponent from '~/theme/containers/DrawerComponent';

const Drawer = createDrawerNavigator();

export default () => {
  return (
    <Drawer.Navigator
      initialRouteName={mainStack.bottomTabs}
      drawerType="slide"
      drawerPosition="left"
      drawerContent={props => <DrawerComponent />}>
      <Drawer.Screen
        name="Main"
        component={BottomTabs}
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
