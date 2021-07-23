import ChatStack from '../ChatStack';
import HomeStack from '../HomeStack';
import GroupStack from '../GroupStack';
import MenuStack from '../MenuStack';
import Notification from '~/screens/Notification';

export const screens = {
  home: HomeStack,
  groups: GroupStack,
  chat: ChatStack,
  notification: Notification,
  menu: MenuStack,
};
