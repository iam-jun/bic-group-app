import {
  AddMembersToGroup,
  Conversation,
  ConversationDetail,
  CreateConversation,
  GroupMembers,
} from '~/screens/Chat';
import GroupAbout from '~/screens/Groups/GroupAbout';
import GroupDetail from '~/screens/Groups/GroupDetail';
import EditGroupDescription from '~/screens/Groups/GroupDetail/groupSettings/EditGroupDescription';
import GeneralInformation from '~/screens/Groups/GroupDetail/groupSettings/GeneralInformation';
import GroupAdministration from '~/screens/Groups/GroupDetail/groupSettings/GroupAdministration';
import Newsfeed from '~/screens/Home';
import AccoutSettings from '~/screens/Menu/AccountSettings';
import EditBasicInfo from '~/screens/Menu/AccountSettings/EditBasicInfo/EditBasicInfo';
import SecurityLogin from '~/screens/Menu/AccountSettings/SecurityLogin';
import ChangePassword from '~/screens/Menu/AccountSettings/SecurityLogin/ChangePassword';
import ComponentCollection from '~/screens/Menu/ComponentCollection';
import UserProfile from '~/screens/Menu/UserProfile';
import NewFeature from '~/screens/NewFeature';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';
import CreateComment from '~/screens/Post/CreateComment';
import CreatePost from '~/screens/Post/CreatePost';
import PostDetail from '~/screens/Post/PostDetail';
import PostSelectAudience from '~/screens/Post/PostSelectAudience';
import ChatStack from '../ChatStack';
import GroupStack from '../GroupStack';
import HomeStack from '../HomeStack';
import MenuStack from '../MenuStack';
import NotiStack from '../NotiStack';

export const screens = {
  home: HomeStack,
  groups: GroupStack,
  chat: ChatStack,
  notification: NotiStack,
  menus: MenuStack,
};

export const screensWebLaptop = {
  newsfeed: Newsfeed,
  // 'conversation-list': ConversationsList,
  conversation: Conversation,
  'conversation-detail': ConversationDetail,
  'create-conversation': CreateConversation,
  'chat-group-members': GroupMembers,
  'add-members': AddMembersToGroup,
  // 'group-list': Groups,
  'group-detail': GroupDetail,
  'group-about': GroupAbout,
  'group-members': GroupMembers,
  'group-files': NewFeature,
  'create-post': CreatePost,
  'create-comment': CreateComment,
  'post-select-audience': PostSelectAudience,
  'post-detail': PostDetail,
  'group-admin': GroupAdministration,
  'general-info': GeneralInformation,
  'edit-group-description': EditGroupDescription,
  'user-profile': UserProfile,
  'invite-members': AddMembersToGroup,
  // menu: Menu,
  'component-collection': ComponentCollection,
  'account-settings': AccoutSettings,
  'security-and-login': SecurityLogin,
  'change-password': ChangePassword,
  'edit-basic-info': EditBasicInfo,
  // notification: Notification,
  'not-select-notification': NoNotificationFound,
};
