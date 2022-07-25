import Groups from '~/screens/Groups';
import GroupDetail from '~/screens/Groups/GroupDetail';
import GroupAbout from '~/screens/Groups/GroupAbout';
import GroupMembers from '~/screens/Groups/GroupMembers';
import GroupAdministration from '~/screens/Groups/GroupDetail/groupSettings/GroupAdministration';
import GeneralInformation from '~/screens/Groups/GeneralInformation';
import EditDescription from '~/screens/Groups/GeneralInformation/EditDescription';
import AddMembersToGroup from '~/screens/Groups/AddMembersToGroup';
import NewFeature from '~/screens/NewFeature';
import GroupPendingMembers from '~/screens/Groups/GroupDetail/groupModerating/PendingMembers';

import Communities from '~/screens/Groups/Communities';
import CommunityDetail from '~/screens/Groups/CommunityDetail';
import YourGroups from '~/screens/Groups/YourGroups';
import CommunityAbout from '~/screens/Groups/CommunityAbout';
import DiscoverGroups from '~/screens/Groups/DiscoverGroups';
import CommunityMembers from '~/screens/Groups/CommunityMembers';
import CommunityAdmin from '~/screens/Groups/CommunityAdmin';
import CommunityPermission from '~/screens/Groups/CommunityPermission';
import CommunityPendingMembers from '~/screens/Groups/CommunityAdmin/PendingMembers';
import CreatePermissionScheme from '~/screens/Groups/CreatePermissionScheme';
import CommunityPermissionDetail from '~/screens/Groups/CommunityPermissionDetail';
import GroupStructureSettings from '~/screens/Groups/GroupStructureSettings';
import MoveGroup from '~/screens/Groups/MoveGroup';
import ReorderGroup from '~/screens/Groups/ReorderGroup';
import EditName from '~/screens/Groups/GeneralInformation/EditName';
import GroupSchemeAssignment from '~/screens/Groups/GroupSchemeAssignment';
import GroupSchemeAssignSelection from '~/screens/Groups/GroupSchemeAssignSelection';

const groupScreens = {
  // community
  communities: Communities,
  'community-detail': CommunityDetail,
  'your-groups': YourGroups,
  'community-about': CommunityAbout,
  'discover-groups': DiscoverGroups,
  'community-members': CommunityMembers,
  'community-admin': CommunityAdmin,
  'community-permission': CommunityPermission,
  'community-permission-detail': CommunityPermissionDetail,
  'group-scheme-assignment': GroupSchemeAssignment,
  'group-scheme-assign-selection': GroupSchemeAssignSelection,
  'community-pending-members': CommunityPendingMembers,
  'create-permission-scheme': CreatePermissionScheme,
  'group-structure-settings': GroupStructureSettings,
  'move-group': MoveGroup,
  'reorder-group': ReorderGroup,

  // group
  'group-list': Groups,
  'group-detail': GroupDetail,
  'group-about': GroupAbout,
  'group-members': GroupMembers,
  'group-files': NewFeature,
  'group-admin': GroupAdministration,
  'general-info': GeneralInformation,
  'edit-name': EditName,
  'edit-description': EditDescription,
  'invite-members': AddMembersToGroup,

  // group moderating
  'group-pending-members': GroupPendingMembers,
}

export default groupScreens;
