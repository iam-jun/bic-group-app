import React from 'react';
import {View, Text} from 'react-native';

import {IMenuItemProps} from '~/interfaces/IMenu';
import GroupContent from './components/GroupContent';

// Todo: this samplescreen is temporary and will be removed
const sampleScreen = () => {
  return (
    <View>
      <Text>This is sample screen</Text>
    </View>
  );
};

const groupProfileTabs: IMenuItemProps[] = [
  {
    routeName: 'Content',
    label: 'Content',
    component: GroupContent,
  },
  {
    routeName: 'About',
    label: 'About',
    component: sampleScreen,
  },
  {
    routeName: 'Members',
    label: 'Members',
    component: sampleScreen,
  },
  {
    routeName: 'Files',
    label: 'Files',
    component: sampleScreen,
  },
];

export default groupProfileTabs;
