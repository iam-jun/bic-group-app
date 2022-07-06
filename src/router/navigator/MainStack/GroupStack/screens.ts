import Groups from '~/screens/Groups';
import GroupDetail from '~/screens/Groups/GroupDetail';
import GroupAbout from '~/screens/Groups/GroupAbout';
import GroupMembers from '~/screens/Groups/GroupMembers';
import CreatePost from '~/screens/Post/CreatePost';
import CreateComment from '~/screens/Post/CreateComment';
import PostSelectAudience from '~/screens/Post/PostSelectAudience';
import PostSelectImage from '~/screens/Post/PostSelectImage';
import PostDetail from '~/screens/Post/PostDetail';
import GroupAdministration from '~/screens/Groups/GroupDetail/groupSettings/GroupAdministration';
import GeneralInformation from '~/screens/Groups/GeneralInformation';
import EditDescription from '~/screens/Groups/GeneralInformation/EditDescription';
import AddMembersToGroup from '~/screens/Groups/AddMembersToGroup';
import NewFeature from '~/screens/NewFeature';
import DraftPost from '~/screens/Post/DraftPost';
import UserProfile from '~/screens/Menu/UserProfile';
import GroupPendingMembers from '~/screens/Groups/GroupDetail/groupModerating/PendingMembers';
import PostSettings from '~/screens/Post/PostSettings';
import CommentDetail from '~/screens/Post/CommentDetail';

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

export default {
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
  'create-post': CreatePost,
  'create-comment': CreateComment,
  'post-select-audience': PostSelectAudience,
  'post-select-image': PostSelectImage,
  'post-detail': PostDetail,
  'post-settings': PostSettings,
  'draft-post': DraftPost,
  'group-admin': GroupAdministration,
  'general-info': GeneralInformation,
  'edit-name': EditName,
  'edit-description': EditDescription,
  'invite-members': AddMembersToGroup,
  'user-profile': UserProfile,
  'comment-detail': CommentDetail,

  // group moderating
  'group-pending-members': GroupPendingMembers,
};
