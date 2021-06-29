import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {spacing} from '~/theme/configs';
import {mainStack} from '~/configs/navigator';
import BottomTabs from '../BottomTabs';
import DrawerComponent from '~/theme/containers/DrawerComponent';
import HomeHeader from '~/theme/containers/HomeHeader';

const Drawer = createDrawerNavigator();

export default () => {
  return (
    <Drawer.Navigator
      initialRouteName={mainStack.bottomTabs}
      drawerType="slide"
      drawerPosition="right"
      drawerContent={props => <DrawerComponent />}>
      <Drawer.Screen
        name="Main"
        component={BottomTabs}
        options={({navigation}) => ({
          headerShown: true,
          headerStyle: {paddingHorizontal: spacing.padding.base},
          headerTitleAlign: 'left',

          header: () => <HomeHeader />,
        })}
      />
    </Drawer.Navigator>
  );
};
