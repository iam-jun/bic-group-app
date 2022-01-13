import GroupAbout from '~/screens/Groups/GroupAbout';
import GroupMembers from '~/screens/Groups/GroupMembers';
import AddMembersToGroup from '~/screens/Groups/AddMembersToGroup';
import GroupDetail from '~/screens/Groups/GroupDetail';
import EditGroupDescription from '~/screens/Groups/GroupDetail/groupSettings/EditGroupDescription';
import GeneralInformation from '~/screens/Groups/GroupDetail/groupSettings/GeneralInformation';
import GroupAdministration from '~/screens/Groups/GroupDetail/groupSettings/GroupAdministration';
import Newsfeed from '~/screens/Home';
import AccoutSettings from '~/screens/Menu/AccountSettings';
import EditBasicInfo from '~/screens/Menu/AccountSettings/EditBasicInfo/EditBasicInfo';
import EditContact from '~/screens/Menu/AccountSettings/EditContact';
import EditEmail from '~/screens/Menu/AccountSettings/EditContact/EditEmail';
import EditPhoneNumber from '~/screens/Menu/AccountSettings/EditContact/EditPhoneNumber';
import EditLocation from '~/screens/Menu/AccountSettings/EditContact/EditLocation';
import SecurityLogin from '~/screens/Menu/AccountSettings/SecurityLogin';
import ChangePassword from '~/screens/Menu/AccountSettings/SecurityLogin/ChangePassword';
import UserEdit from '~/screens/Menu/AccountSettings/UserEditProfile';
import ComponentCollection from '~/screens/Menu/ComponentCollection';
import UserProfile from '~/screens/Menu/UserProfile';
import NewFeature from '~/screens/NewFeature';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';
import CreateComment from '~/screens/Post/CreateComment';
import CreatePost from '~/screens/Post/CreatePost';
import PostDetail from '~/screens/Post/PostDetail';
import PostSelectAudience from '~/screens/Post/PostSelectAudience';
import PostSelectImage from '~/screens/Post/PostSelectImage';
import PostSettings from '~/screens/Post/PostSettings';
import GroupStack from '../GroupStack';
import HomeStack from '../HomeStack';
import MenuStack from '../MenuStack';
import NotiStack from '../NotiStack';
import DraftPost from '~/screens/Post/DraftPost';
import AddWork from '~/screens/Menu/AccountSettings/WorkExperience/AddWork';
import PendingMembers from '~/screens/Groups/GroupDetail/groupModerating/PendingMembers';

export const screens = {
  home: HomeStack,
  groups: GroupStack,
  notification: NotiStack,
  menus: MenuStack,
};

export const screensWebLaptop = {
  //HOME STACK
  newsfeed: Newsfeed,
  'create-post': CreatePost,
  'create-comment': CreateComment,
  'post-select-audience': PostSelectAudience,
  'post-select-image': PostSelectImage,
  'post-detail': PostDetail,
  'draft-post': DraftPost,
  'post-settings': PostSettings,

  //GROUP STACK
  // 'group-list': Groups,
  'group-detail': GroupDetail,
  'group-about': GroupAbout,
  'group-members': GroupMembers,
  'group-files': NewFeature,
  'group-admin': GroupAdministration,
  'general-info': GeneralInformation,
  'edit-group-description': EditGroupDescription,
  'invite-members': AddMembersToGroup,
  'pending-members': PendingMembers,

  //MENU STACK
  // menu: Menu,
  'user-profile': UserProfile,
  'user-edit': UserEdit,
  'component-collection': ComponentCollection,
  'account-settings': AccoutSettings,
  'security-and-login': SecurityLogin,
  'change-password': ChangePassword,
  'edit-basic-info': EditBasicInfo,
  'edit-contact': EditContact,
  'edit-email': EditEmail,
  'edit-phone-number': EditPhoneNumber,
  'edit-location': EditLocation,
  'add-work': AddWork,

  //NOTIFICATION STACK
  // notification: Notification,
  'not-select-notification': NoNotificationFound,
};
