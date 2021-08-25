import Groups from '~/screens/Groups';
import GroupDetail from '~/screens/Groups/GroupDetail';
import CreatePost from '~/screens/Post/CreatePost';
import PostDetail from '~/screens/Post/PostDetail';
import GroupAdministration from '~/screens/Groups/GroupDetail/groupSettings/GroupAdministration';
import GeneralInformation from '~/screens/Groups/GroupDetail/groupSettings/GeneralInformation';
import EditGroupDescription from '~/screens/Groups/GroupDetail/groupSettings/EditGroupDescription';
import PrivateView from '~/screens/Menu/UserProfile/PrivateView';
import PublicView from '~/screens/Menu/UserProfile/PublicView';
import AddMembersToGroup from '~/screens/Groups/AddMembersToGroup';

export default {
  'group-list': Groups,
  'group-detail': GroupDetail,
  'create-post': CreatePost,
  'post-detail': PostDetail,
  'group-admin': GroupAdministration,
  'general-info': GeneralInformation,
  'edit-group-description': EditGroupDescription,
  'my-profile': PrivateView,
  'public-profile': PublicView,
  'invite-members': AddMembersToGroup,
};
