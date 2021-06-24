import React from 'react';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from '~/theme/components/Icon';
import * as screens from '~/router/navigator/tab';

import {tabsSetting} from '~/configs/navigator';

import {IObject} from '~/interfaces/common';
import {spacing} from '~/theme/configs';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const {i18n} = useTranslation();
  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  const lang: string = i18n.language;
  const backBehavior = 'initialRoute';

  const {initialRouteName} = tabsSetting.configs;

  const {activeColor, inactiveColor, tabBarBackground} = colors;

  const {tabsNavigator} = tabsSetting;

  const listScreens: IObject<any> = screens;

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      backBehavior={backBehavior}
      tabBarOptions={{
        activeTintColor: activeColor,
        inactiveTintColor: inactiveColor,
        style: {
          backgroundColor: tabBarBackground,
          paddingBottom: spacing.padding.small,
          // paddingBottom: theme.spacing.padding.large * 2,
          // height: theme.spacing.padding.big * 2,
        },
      }}>
      {tabsNavigator.map((tab: IObject<any>, _i: number) => {
        return (
          <Tab.Screen
            key={'tabs' + tab.screen}
            name={tab.name[lang]}
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
              title: tab.name[lang],
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default BottomTabs;
