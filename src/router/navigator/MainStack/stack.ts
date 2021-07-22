import {Conversation} from '~/screens/Chat';
import Menu from './MenuStack';
import Notification from '~/screens/Notification';
import CommentDetail from '~/screens/Home/Comment';
import CreatePost from '~/screens/CreatePost';
import SelectPostAudience from '~/screens/CreatePost/SelectAudience';
import MainTabs from './MainTabs';

export const screens = {
  main: MainTabs,
  comment: CommentDetail,
  'create-post': CreatePost,
  'select-audience': SelectPostAudience,
  conversation: Conversation,
  notification: Notification,
  menu: Menu,
};

export const mainStack = {
  main: 'main',
  comment: 'comment',
  createPost: 'create-post',
  selectAudience: 'select-audience',
  conversation: 'conversation',
  notification: 'notification',
  menu: 'menu',
};
