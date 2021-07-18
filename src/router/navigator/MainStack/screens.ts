import Chat, {Conversation} from '~/screens/Chat';
import Home from '~/screens/Home';
import Menu from '~/screens/Menu';
import Notification from '~/screens/Notification';
import GroupTabs from './GroupTabs';

const screens = {
  home: Home,
  chat: Chat,
  conversation: Conversation,
  notification: Notification,
  groups: GroupTabs,
  menu: Menu,
};

export default screens;
