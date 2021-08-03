import React from 'react';
import {useTheme} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Icon from '~/beinComponents/Icon';

import {createSideTabNavigator} from '../../../components/SideTabNavigator';
import {useWindowDimensions} from 'react-native';
import {deviceDimensions} from '~/theme/dimension';
import {ITheme} from '~/theme/interfaces';
import {screens} from './screens';
import {bottomTabIcons, bottomTabIconsFocused} from '~/configs/navigator';

const BottomTab = createBottomTabNavigator();
const SideTab = createSideTabNavigator();

const MainTabs = () => {
  const theme: ITheme = useTheme();
  const {colors} = theme;

  const backBehavior = 'history';

  // const {activeColor, inactiveColor, tabBarBackground} = colors;

  const insets = useSafeAreaInsets();
  const dimensions = useWindowDimensions();
  const isPhone = dimensions.width < deviceDimensions.smallTablet;
  const isBigTablet = dimensions.width >= deviceDimensions.bigTablet;

  const Tab = isPhone ? BottomTab : SideTab;

  return (
    // @ts-ignore
    <Tab.Navigator
      backBehavior={backBehavior}
      tabBarOptions={{
        // activeTintColor: activeColor,
        // inactiveTintColor: inactiveColor,
        keyboardHidesTabBar: true,
        activeTintColor: colors.primary7,
        inactiveTintColor: colors.textSecondary,
        activeBackgroundColor: colors.bgButtonSecondary,
        style: {
          // backgroundColor: tabBarBackground,
          paddingBottom: !isPhone ? 0 : insets.bottom,
        },
      }}>
      {Object.entries(screens).map(([name, component]) => {
        return (
          // @ts-ignore
          <Tab.Screen
            key={'tabs' + name}
            name={name.charAt(0).toUpperCase() + name.slice(1)} // Just capitalize name
            component={component}
            options={{
              tabBarIcon: ({focused, color}) => {
                const icon = focused ? bottomTabIconsFocused : bottomTabIcons;
                if (!isBigTablet)
                  return (
                    <Icon
                      //@ts-ignore
                      icon={icon[name]}
                      style={{padding: 0}}
                      size={24}
                      tintColor={color}
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
