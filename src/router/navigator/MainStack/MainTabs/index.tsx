import React from 'react';
import {useTheme} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Icon from '~/beinComponents/Icon';

import {createTabNavigator} from '../../../components/TabNavigator';
import {useWindowDimensions} from 'react-native';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {screens} from './screens';
import {bottomTabIcons} from '~/configs/navigator';

const BottomTab = createBottomTabNavigator();
const SideTab = createTabNavigator();

const MainTabs = () => {
  const theme: ITheme = useTheme();
  const {colors} = theme;

  const backBehavior = 'history';

  // const {activeColor, inactiveColor, tabBarBackground} = colors;

  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const phone = dimensions.width < deviceDimensions.smallTablet;
  const bigTablet = dimensions.width >= deviceDimensions.bigTablet;

  const Tab = phone ? BottomTab : SideTab;

  return (
    // @ts-ignore
    <Tab.Navigator
      backBehavior={backBehavior}
      tabBarOptions={{
        // activeTintColor: activeColor,
        // inactiveTintColor: inactiveColor,
        keyboardHidesTabBar: true,
        style: {
          // backgroundColor: tabBarBackground,
          paddingBottom: !phone ? insets.bottom : 0,
        },
      }}>
      {Object.entries(screens).map(([name, component]) => {
        return (
          // @ts-ignore
          <Tab.Screen
            key={'tabs' + name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({focused, color}) => {
                if (!bigTablet)
                  return (
                    <Icon
                      //@ts-ignore
                      icon={bottomTabIcons[name]}
                      size={24}
                      tintColor={color}
                      bold={focused}
                    />
                  );
                return null;
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default MainTabs;
