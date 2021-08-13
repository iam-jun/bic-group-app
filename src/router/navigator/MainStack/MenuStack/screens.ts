import Menu from '~/screens/Menu';
import ComponentCollection from '~/screens/Menu/ComponentCollection';
import AccoutSettings from '~/screens/Menu/AccountSettings';
import UserProfile from '~/screens/Menu/AccountSettings/UserProfile';
import PrivateView from '~/screens/Menu/UserProfile/PrivateView';
import SecurityLogin from '~/screens/Menu/AccountSettings/SecurityLogin';

export default {
  menu: Menu,
  'component-collection': ComponentCollection,
  'account-settings': AccoutSettings,
  'user-profile': UserProfile,
  'my-profile': PrivateView,
  'security-and-login': SecurityLogin,
};
