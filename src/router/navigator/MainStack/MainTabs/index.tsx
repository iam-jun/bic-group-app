import React from 'react';
import {useTheme} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Icon from '~/beinComponents/Icon';

import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {useWindowDimensions} from 'react-native';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {leftScreens, centerScreens} from './screens';
import icons from './icons';

const BottomTab = createBottomTabNavigator();
const SideTab = createSideTabNavigator();

const MainTabs = () => {
  const theme: ITheme = useTheme();
  const {colors} = theme;

  const backBehavior = 'initialRoute';

  // const {activeColor, inactiveColor, tabBarBackground} = colors;

  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();

  const screens =
    dimensions.width > deviceDimensions.bigTablet ? leftScreens : centerScreens;

  const Tab =
    dimensions.width > deviceDimensions.smallTablet ? SideTab : BottomTab;

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
          paddingBottom: insets.bottom,
          // height: theme.spacing.padding.big * 2,
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
                return (
                  <Icon
                    icon={icons[name as keyof typeof icons]}
                    size={24}
                    tintColor={color}
                    bold={focused}
                  />
                );
              },
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default MainTabs;
