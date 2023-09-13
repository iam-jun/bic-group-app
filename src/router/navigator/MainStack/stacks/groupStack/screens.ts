import GroupDetail from '~/screens/groups/GroupDetail';
import GroupAbout from '~/screens/groups/GroupAbout';
import GroupMembers from '~/screens/groups/GroupMembers';
import GroupAdministration from '~/screens/groups/GroupDetail/groupSettings/GroupAdministration';
import GeneralInformation from '~/screens/groups/GeneralInformation';
import EditDescription from '~/screens/groups/GeneralInformation/EditDescription';
import NewFeature from '~/components/NewFeature';

import Communities from '~/screens/communities/Communities';
import CommunityDetail from '~/screens/communities/CommunityDetail';
import CommunityAbout from '~/screens/communities/CommunityAbout';
import DiscoverGroups from '~/screens/groups/DiscoverGroups';
import CommunityMembers from '~/screens/communities/CommunityMembers';
import CommunityAdmin from '~/screens/communities/CommunityAdmin';
import EditName from '~/screens/groups/GeneralInformation/EditName';
import EditPrivacy from '~/screens/groups/GeneralInformation/EditPrivacy';
import MembershipPolicySettings from '~/screens/groups/MembershipPolicySettings';

const groupScreens = {
  // community
  communities: Communities,
  'community-detail': CommunityDetail,
  'community-about': CommunityAbout,
  'discover-groups': DiscoverGroups,
  'community-members': CommunityMembers,
  'community-admin': CommunityAdmin,

  // group
  'group-detail': GroupDetail,
  'group-about': GroupAbout,
  'group-members': GroupMembers,
  'group-files': NewFeature,
  'group-admin': GroupAdministration,
  'general-info': GeneralInformation,
  'edit-name': EditName,
  'edit-description': EditDescription,
  'edit-privacy': EditPrivacy,
  'membership-policy-settings': MembershipPolicySettings,

  // group structure removed
  // permission scheme removed
};

export default groupScreens;
