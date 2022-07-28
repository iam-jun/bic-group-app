import Menu from '~/screens/Menu';
import ComponentCollection from '~/screens/Menu/ComponentCollection';
import AccoutSettings from '~/screens/Menu/AccountSettings';
import SecurityLogin from '~/screens/Menu/AccountSettings/SecurityLogin';
import ChangePassword from '~/screens/Menu/AccountSettings/SecurityLogin/ChangePassword';
import UserEdit from '~/screens/Menu/AccountSettings/UserEditProfile';
import EditBasicInfo from '~/screens/Menu/AccountSettings/EditBasicInfo/EditBasicInfo';
import EditContact from '~/screens/Menu/AccountSettings/EditContact';
import AddWork from '~/screens/Menu/AccountSettings/WorkExperience/AddWork';

const menuScreens = {
  menu: Menu,
  'component-collection': ComponentCollection,
  'account-settings': AccoutSettings,
  'security-and-login': SecurityLogin,
  'change-password': ChangePassword,
  'user-edit': UserEdit,
  'edit-basic-info': EditBasicInfo,
  'edit-contact': EditContact,
  'add-work': AddWork,
}

export default menuScreens;
