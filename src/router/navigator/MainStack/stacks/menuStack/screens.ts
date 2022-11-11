import Menu from '~/screens/Menu';
import ComponentCollection from '~/screens/Menu/ComponentCollection';
import AccoutSettings from '~/screens/Menu/AccountSettings';
import SecurityLogin from '~/screens/Menu/AccountSettings/SecurityLogin';
import ChangePassword from '~/screens/Menu/AccountSettings/SecurityLogin/ChangePassword';
import UserEdit from '~/screens/Menu/AccountSettings/UserEditProfile';
import EditBasicInfo from '~/screens/Menu/AccountSettings/EditBasicInfo/EditBasicInfo';
import EditContact from '~/screens/Menu/AccountSettings/EditContact';
import AddWork from '~/screens/Menu/AccountSettings/WorkExperience/AddWork';
import Discover from '~/screens/Discover';
import EditDescription from '~/screens/Menu/AccountSettings/EditDescription';
import Draft from '~/screens/Draft';

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
  discover: Discover,
  'user-edit-descriptions': EditDescription,
  draft: Draft,
};

export default menuScreens;
