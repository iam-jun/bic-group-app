import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useBaseHook} from '~/hooks';
import {SubscribedGroupScreen, DiscoverGroupScreen, MyGroupScreen} from './Tab';

const TopTab = createMaterialTopTabNavigator();

const Groups = () => {
  const {t} = useBaseHook();

  return (
    <TopTab.Navigator>
      <TopTab.Screen
        name={t('group:title_group_tab_subscribed')}
        component={SubscribedGroupScreen}
      />
      <TopTab.Screen
        name={t('group:title_group_tab_discover')}
        component={DiscoverGroupScreen}
      />
      <TopTab.Screen
        name={t('group:title_group_tab_my_group')}
        component={MyGroupScreen}
      />
    </TopTab.Navigator>
  );
};

export default Groups;
