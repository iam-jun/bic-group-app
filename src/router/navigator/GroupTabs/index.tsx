import React from 'react';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import * as screens from './tabs';
import {groupTabsSetting} from '~/configs/navigator';
import {IObject} from '~/interfaces/common';

const TopTab = createMaterialTopTabNavigator();

const GroupTabs = () => {
  const {i18n} = useTranslation();
  const theme: IObject<any> = useTheme();
  const {colors} = theme;

  const lang: string = i18n.language;
  const backBehavior = 'initialRoute';

  const {initialRouteName} = groupTabsSetting.configs;
  const {tabsNavigator} = groupTabsSetting;

  const {activeColor, inactiveColor, tabBarBackground} = colors;

  const listScreens: IObject<any> = screens;

  return (
    <TopTab.Navigator
      initialRouteName={initialRouteName}
      backBehavior={backBehavior}
      tabBarOptions={{
        activeTintColor: activeColor,
        inactiveTintColor: inactiveColor,
        style: {
          backgroundColor: tabBarBackground,
        },
      }}>
      {tabsNavigator.map((tab: IObject<any>, _i: number) => {
        return (
          <TopTab.Screen
            key={'tabs' + tab.screen}
            name={tab.name[lang]}
            component={listScreens[tab.screen]}
          />
        );
      })}
    </TopTab.Navigator>
  );
};

export default GroupTabs;
