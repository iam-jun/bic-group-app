import GroupDetail from '~/screens/groups/GroupDetail';
import GroupAbout from '~/screens/groups/GroupAbout';
import GroupMembers from '~/screens/groups/GroupMembers';
import GroupAdministration from '~/screens/groups/GroupDetail/groupSettings/GroupAdministration';
import GeneralInformation from '~/screens/groups/GeneralInformation';
import EditDescription from '~/screens/groups/GeneralInformation/EditDescription';
import AddMembersToGroup from '~/screens/groups/AddMembersToGroup';
import NewFeature from '~/components/NewFeature';
import GroupPendingMembers from '~/screens/groups/GroupDetail/groupModerating/PendingMembers';

import Communities from '~/screens/communities/Communities';
import CommunityDetail from '~/screens/communities/CommunityDetail';
import YourGroups from '~/screens/groups/YourGroups';
import CommunityAbout from '~/screens/communities/CommunityAbout';
import DiscoverGroups from '~/screens/groups/DiscoverGroups';
import CommunityMembers from '~/screens/communities/CommunityMembers';
import CommunityAdmin from '~/screens/communities/CommunityAdmin';
import PermissionScheme from '~/screens/PermissionScheme';
import CommunityPendingMembers from '~/screens/communities/CommunityAdmin/PendingMembers';
import CreatePermissionScheme from '~/screens/PermissionScheme/CreatePermissionScheme';
import SchemeDetail from '~/screens/PermissionScheme/SchemeDetail';
import GroupStructureSettings from '~/screens/groups/GroupStructureSettings';
import MoveGroup from '~/screens/groups/GroupStructureSettings/MoveGroup';
import ReorderGroup from '~/screens/groups/GroupStructureSettings/ReorderGroup';
import EditName from '~/screens/groups/GeneralInformation/EditName';
import GroupSchemeAssignment from '~/screens/PermissionScheme/GroupSchemeAssignment';
import GroupSchemeAssignSelection from '~/screens/PermissionScheme/GroupSchemeAssignSelection';

const groupScreens = {
  // permission scheme
  'permission-scheme': PermissionScheme,
  'scheme-detail': SchemeDetail,
  'group-scheme-assignment': GroupSchemeAssignment,
  'group-scheme-assign-selection': GroupSchemeAssignSelection,
  'create-permission-scheme': CreatePermissionScheme,

  // community
  communities: Communities,
  'community-detail': CommunityDetail,
  'your-groups': YourGroups,
  'community-about': CommunityAbout,
  'discover-groups': DiscoverGroups,
  'community-members': CommunityMembers,
  'community-admin': CommunityAdmin,
  'community-pending-members': CommunityPendingMembers,

  // group
  'group-detail': GroupDetail,
  'group-about': GroupAbout,
  'group-members': GroupMembers,
  'group-files': NewFeature,
  'group-admin': GroupAdministration,
  'general-info': GeneralInformation,
  'edit-name': EditName,
  'edit-description': EditDescription,
  'invite-members': AddMembersToGroup,

  // group structure
  'group-structure-settings': GroupStructureSettings,
  'move-group': MoveGroup,
  'reorder-group': ReorderGroup,

  // group moderating
  'group-pending-members': GroupPendingMembers,
}

export default groupScreens;
