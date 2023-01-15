import CreatePost from '~/screens/post/CreatePost';
import PostDetail from '~/screens/post/PostDetail';
import PostSelectAudience from '~/screens/post/PostSelectAudience';
import DraftPost from '~/screens/Draft/DraftPost';
import UserProfile from '~/screens/Menu/UserProfile';
import PostSettings from '~/screens/post/PostSettings';
import CommentDetail from '~/screens/comments/CommentDetail';
import EditComment from '~/screens/comments/EditComment';

const homeScreens = {
  'post-detail': PostDetail,
  'create-post': CreatePost,
  'edit-comment': EditComment,
  'post-select-audience': PostSelectAudience,
  'draft-post': DraftPost,
  'user-profile': UserProfile,
  'post-settings': PostSettings,
  'comment-detail': CommentDetail,
};

export default homeScreens;
