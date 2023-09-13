import Menu from '~/screens/Menu';
import ComponentCollection from '~/screens/Menu/ComponentCollection';
import AccoutSettings from '~/screens/Menu/AccountSettings';
import SecurityLogin from '~/screens/Menu/AccountSettings/SecurityLogin';
import ChangePassword from '~/screens/Menu/AccountSettings/SecurityLogin/ChangePassword';
import EditBasicInfo from '~/screens/Menu/AccountSettings/EditBasicInfo/EditBasicInfo';
import EditContact from '~/screens/Menu/AccountSettings/EditContact';
import AddWork from '~/screens/Menu/AccountSettings/WorkExperience/AddWork';
import Discover from '~/screens/Discover';
import YourContent from '~/screens/YourContent';
import Blocking from '~/screens/Menu/AccountSettings/Blocking';
import PrivacyCenter from '~/screens/Menu/AccountSettings/PrivacyCenter';
import PersonalInfoVisibility from '~/screens/Menu/AccountSettings/PrivacyCenter/PersonalInfoVisibility';
import InvitationPrivacy from '~/screens/Menu/AccountSettings/PrivacyCenter/InvitationPrivacy';

const menuScreens = {
  menu: Menu,
  'component-collection': ComponentCollection,
  'account-settings': AccoutSettings,
  'security-and-login': SecurityLogin,
  'change-password': ChangePassword,
  'edit-basic-info': EditBasicInfo,
  'edit-contact': EditContact,
  'add-work': AddWork,
  discover: Discover,
  'your-content': YourContent,
  blocking: Blocking,
  'privacy-center': PrivacyCenter,
  'personal-info-visibility': PersonalInfoVisibility,
  'invitation-privacy': InvitationPrivacy,
};

export default menuScreens;
