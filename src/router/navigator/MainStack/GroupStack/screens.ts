import Groups from '~/screens/Groups';
import GroupDetail from '~/screens/Groups/GroupDetail';
import CreatePost from '~/screens/Post/CreatePost';
import CreateComment from '~/screens/Post/CreateComment';
import PostSelectAudience from '~/screens/Post/PostSelectAudience';
import PostDetail from '~/screens/Post/PostDetail';
import GroupAdministration from '~/screens/Groups/GroupDetail/groupSettings/GroupAdministration';
import GeneralInformation from '~/screens/Groups/GroupDetail/groupSettings/GeneralInformation';
import EditGroupDescription from '~/screens/Groups/GroupDetail/groupSettings/EditGroupDescription';
import MyProfile from '~/screens/Menu/UserProfile/MyProfile';
import UserProfile from '~/screens/Menu/UserProfile/UserProfile';
import AddMembersToGroup from '~/screens/Groups/AddMembersToGroup';

export default {
  'group-list': Groups,
  'group-detail': GroupDetail,
  'create-post': CreatePost,
  'create-comment': CreateComment,
  'post-select-audience': PostSelectAudience,
  'post-detail': PostDetail,
  'group-admin': GroupAdministration,
  'general-info': GeneralInformation,
  'edit-group-description': EditGroupDescription,
  'my-profile': MyProfile,
  'user-profile': UserProfile,
  'invite-members': AddMembersToGroup,
};
