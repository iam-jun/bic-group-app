import Notification from '~/screens/Notification';
import NoNotificationFound from '~/screens/Notification/components/NoNotificationFound';
import PostDetail from '~/screens/Post/PostDetail';
import CommentDetail from '~/screens/Post/CommentDetail';

export default {
  // TODO: add screen that need to navigate from tab Notification
  notification: Notification,
  'post-detail': PostDetail,
  'not-select-notification': NoNotificationFound,
  'comment-detail': CommentDetail,
};
