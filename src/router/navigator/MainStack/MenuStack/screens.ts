import Menu from '~/screens/Menu';
import ComponentCollection from '~/screens/Menu/ComponentCollection';
import AccoutSettings from '~/screens/Menu/AccountSettings';
import UserProfile from '~/screens/Menu/AccountSettings/UserProfile';
import PrivateView from '~/screens/Menu/UserProfile/PrivateView';
import SecurityLogin from '~/screens/Menu/AccountSettings/SecurityLogin';
import ChangePassword from '~/screens/Menu/AccountSettings/SecurityLogin/ChangePassword';
import EditBasicInfo from '~/screens/Menu/AccountSettings/EditBasicInfo/EditBasicInfo';

export default {
  menu: Menu,
  'component-collection': ComponentCollection,
  'account-settings': AccoutSettings,
  'user-profile': UserProfile,
  'my-profile': PrivateView,
  'security-and-login': SecurityLogin,
  'change-password': ChangePassword,
  'edit-basic-info': EditBasicInfo,
};
