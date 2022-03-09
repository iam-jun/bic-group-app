import MainTabs from './MainTabs';
import UserProfile from '~/screens/Menu/UserProfile';
import UserEdit from '~/screens/Menu/AccountSettings/UserEditProfile';
import EditBasicInfo from '~/screens/Menu/AccountSettings/EditBasicInfo/EditBasicInfo';
import EditContact from '~/screens/Menu/AccountSettings/EditContact';
import EditEmail from '~/screens/Menu/AccountSettings/EditContact/EditEmail';
import AddWork from '~/screens/Menu/AccountSettings/WorkExperience/AddWork';
import EditDescription from '~/screens/Menu/AccountSettings/EditDescription';
import AccoutSettings from '~/screens/Menu/AccountSettings';
import ComponentCollection from '~/screens/Menu/ComponentCollection';
import SecurityLogin from '~/screens/Menu/AccountSettings/SecurityLogin';
import ChangePassword from '~/screens/Menu/AccountSettings/SecurityLogin/ChangePassword';

export default {
  main: MainTabs,
  'user-profile': UserProfile,
  'user-edit': UserEdit,
  'edit-basic-info': EditBasicInfo,
  'edit-contact': EditContact,
  'edit-email': EditEmail,
  'add-work': AddWork,
  'edit-description': EditDescription,
  'account-settings': AccoutSettings,
  'component-collection': ComponentCollection,
  'security-and-login': SecurityLogin,
  'change-password': ChangePassword,
};
