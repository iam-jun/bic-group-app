import MainTabs from './MainTabs';
import UserProfile from '~/screens/Menu/UserProfile';
import UserEdit from '~/screens/Menu/AccountSettings/UserEditProfile';
import EditBasicInfo from '~/screens/Menu/AccountSettings/EditBasicInfo/EditBasicInfo';
import EditContact from '~/screens/Menu/AccountSettings/EditContact';

export default {
  main: MainTabs,
  'user-profile': UserProfile,
  'user-edit': UserEdit,
  'edit-basic-info': EditBasicInfo,
  'edit-contact': EditContact,
};
