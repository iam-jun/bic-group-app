import {IMenuItemProps} from '~/interfaces/IMenu';
import GroupContent from './components/GroupContent';
import GroupMembers from '~/screens/Groups/GroupDetail/components/GroupMembers';
import GroupAbout from '~/screens/Groups/GroupDetail/components/GroupAbout';
import NewFeature from '~/beinFragments/NewFeature';

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
    component: NewFeature,
  },
];

export default groupProfileTabs;
