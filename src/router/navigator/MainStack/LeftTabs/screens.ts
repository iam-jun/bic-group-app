import Groups from '~/screens/Groups';
import HomeLeftPanel from '~/screens/Home/LeftPanel';
import Notification from '~/screens/Notification';
import Menu from '~/screens/Menu';
import {ConversationsList} from '~/screens/Chat';

export const screens = {
  home: HomeLeftPanel,
  groups: Groups,
  chat: ConversationsList,
  notification: Notification,
  menu: Menu,
};
