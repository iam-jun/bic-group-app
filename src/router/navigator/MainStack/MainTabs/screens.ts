import ChatStack from '../ChatStack';
import HomeStack from '../HomeStack';
import GroupStack from '../GroupStack';
import MenuStack from '../MenuStack';
import Notification from '~/screens/Notification';
import MyProfilePage from '~/screens/Menu/MyProfilePage';

export const screens = {
  home: HomeStack,
  groups: GroupStack,
  chat: ChatStack,
  notification: Notification,
  menus: MenuStack,
  'my-profile': MyProfilePage,
};
