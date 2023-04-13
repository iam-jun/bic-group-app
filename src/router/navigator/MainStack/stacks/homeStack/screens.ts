import CreatePost from '~/screens/post/CreatePost';
import PostDetail from '~/screens/post/PostDetail';
import PostSelectAudience from '~/screens/post/PostSelectAudience';
import DraftPost from '~/screens/YourContent/components/Draft/DraftPost';
import UserProfile from '~/screens/Menu/UserProfile';
import PostSettings from '~/screens/post/PostSettings';
import CommentDetail from '~/screens/comments/CommentDetail';
import EditComment from '~/screens/comments/EditComment';
import CreatePostTags from '~/screens/post/CreatePostTags';
import CreatePostSeries from '~/screens/post/CreatePostSeries';
import PinContent from '~/screens/PinContent';

const homeScreens = {
  'post-detail': PostDetail,
  'create-post': CreatePost,
  'edit-comment': EditComment,
  'post-select-audience': PostSelectAudience,
  'draft-post': DraftPost,
  'user-profile': UserProfile,
  'post-settings': PostSettings,
  'create-post-tags': CreatePostTags,
  'create-post-series': CreatePostSeries,
  'comment-detail': CommentDetail,
  'pin-content': PinContent,
};

export default homeScreens;
