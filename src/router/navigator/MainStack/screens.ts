import MainTabs from './MainTabs';
import UserProfile from '~/screens/Menu/UserProfile';
import UserEdit from '~/screens/Menu/AccountSettings/UserEditProfile';
import EditBasicInfo from '~/screens/Menu/AccountSettings/EditBasicInfo/EditBasicInfo';
import EditContact from '~/screens/Menu/AccountSettings/EditContact';
import EditEmail from '~/screens/Menu/AccountSettings/EditContact/EditEmail';
import EditPhoneNumber from '~/screens/Menu/AccountSettings/EditContact/EditPhoneNumber';
import EditLocation from '~/screens/Menu/AccountSettings/EditContact/EditLocation';
import AddWork from '~/screens/Menu/AccountSettings/WorkExperience/AddWork';

export default {
  main: MainTabs,
  'user-profile': UserProfile,
  'user-edit': UserEdit,
  'edit-basic-info': EditBasicInfo,
  'edit-contact': EditContact,
  'edit-email': EditEmail,
  'edit-phone-number': EditPhoneNumber,
  'edit-location': EditLocation,
  'add-work': AddWork,
};
