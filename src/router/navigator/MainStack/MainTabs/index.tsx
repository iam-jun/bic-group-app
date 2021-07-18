import React from 'react';
import {useTheme} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Icon from '~/components/Icon';
import * as screens from '~/router/navigator/MainStack/MainTabs/tab';
import {tabsSetting} from '~/configs/navigator';
import {IObject} from '~/interfaces/common';
import {createSideTabNavigator} from '../../../components/SideTabNavigator';

const BottomTab = createBottomTabNavigator();
const SideTab = createSideTabNavigator();

export interface Props {
  position: 'side' | 'bottom';
}

const MainTabs: React.FC<Props> = ({position}) => {
  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  const backBehavior = 'initialRoute';

  const {initialRouteName} = tabsSetting.configs;

  const {activeColor, inactiveColor, tabBarBackground} = colors;

  const {tabsNavigator} = tabsSetting;

  const listScreens: IObject<any> = screens;
  const insets = useSafeAreaInsets();

  const Tab = position === 'side' ? SideTab : BottomTab;

  return (
    // @ts-ignore
    <Tab.Navigator
      initialRouteName={initialRouteName}
      backBehavior={backBehavior}
      tabBarOptions={{
        activeTintColor: activeColor,
        inactiveTintColor: inactiveColor,
        keyboardHidesTabBar: true,
        style: {
          backgroundColor: tabBarBackground,
          paddingBottom: insets.bottom,
          // height: theme.spacing.padding.big * 2,
        },
      }}>
      {tabsNavigator.map((tab: IObject<any>, _i: number) => {
        return (
          // @ts-ignore
          <Tab.Screen
            key={'tabs' + tab.screen}
            name={tab.screen}
            component={listScreens[tab.screen]}
            options={{
              tabBarIcon: ({focused, color}) => {
                return (
                  <Icon
                    icon={tab.option.tabBarIcon}
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
