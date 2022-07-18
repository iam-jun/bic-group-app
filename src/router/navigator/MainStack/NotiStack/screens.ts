import Notification from '~/screens/Notification';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';
import PostDetail from '~/screens/Post/PostDetail';
import CommentDetail from '~/screens/Post/CommentDetail';
import GeneralInformation from '~/screens/Groups/GeneralInformation';
import CommunityMembers from '~/screens/Groups/CommunityMembers';
import GroupMembers from '~/screens/Groups/GroupMembers';
import CommunityPendingMembers from '~/screens/Groups/CommunityAdmin/PendingMembers';
import GroupPendingMembers from '~/screens/Groups/GroupDetail/groupModerating/PendingMembers';

export default {
  // TODO: add screen that need to navigate from tab Notification
  notification: Notification,
  'post-detail': PostDetail,
  'not-select-notification': NoNotificationFound,
  'comment-detail': CommentDetail,
  'general-info': GeneralInformation,
  'community-members': CommunityMembers,
  'group-members': GroupMembers,

  'community-pending-members': CommunityPendingMembers,
  'group-pending-members': GroupPendingMembers,
};
