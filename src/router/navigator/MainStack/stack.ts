import Chat, {Conversation} from '~/screens/Chat';
import Home from './HomeStack';
import Menu from './MenuStack';
import Notification from '~/screens/Notification';
import GroupStack from './GroupStack';
import CommentDetail from '~/screens/Home/Comment';
import CreatePost from '~/screens/CreatePost';
import SelectPostAudience from '~/screens/CreatePost/SelectAudience';
import ComponentCollection from '~/screens/Menu/ComponentCollection';
import GroupDetail from '~/screens/Groups/GroupDetail';
import MainTabs from './MainTabs';

export const screens = {
  main: MainTabs,
  home: Home,
  comment: CommentDetail,
  'create-post': CreatePost,
  'select-audience': SelectPostAudience,
  chat: Chat,
  conversation: Conversation,
  notification: Notification,
  menu: Menu,
  group: GroupStack,
  'group-detail': GroupDetail,
  'component-collection': ComponentCollection,
};

export const mainStack = {
  main: 'main',
  home: 'home',
  comment: 'comment',
  createPost: 'create-post',
  selectAudience: 'select-audience',
  chat: 'chat',
  conversation: 'conversation',
  notification: 'notification',
  menu: 'menu',
  group: 'group',
  groupDetail: 'group-detail',
  componentCollection: 'component-collection',
};
