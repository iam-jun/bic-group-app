import React from 'react';
import {View} from 'react-native';

import {IMenuItemProps} from '~/interfaces/IMenu';
import GroupContent from './components/GroupContent';
import GroupMembers from '~/screens/Groups/GroupDetail/components/GroupMembers';
import GroupAbout from '~/screens/Groups/GroupDetail/components/GroupAbout';
import NewFeature from '~/beinFragments/NewFeature';

// TODO: Replace with real File tab
const GroupFiles = () => {
  return (
    <View style={{height: 415}}>
      <NewFeature />
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
    component: GroupAbout,
  },
  {
    routeName: 'Members',
    label: 'Members',
    component: GroupMembers,
  },
  {
    routeName: 'Files',
    label: 'Files',
    component: GroupFiles,
  },
];

export default groupProfileTabs;
