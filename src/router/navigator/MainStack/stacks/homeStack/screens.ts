import CreateComment from '~/screens/post/CreateComment';
import CreatePost from '~/screens/post/CreatePost';
import PostDetail from '~/screens/post/PostDetail';
import PostSelectAudience from '~/screens/post/PostSelectAudience';
import PostSelectImage from '~/screens/post/PostSelectImage';
import DraftPost from '~/screens/post/DraftPost';
import UserProfile from '~/screens/Menu/UserProfile';
import PostSettings from '~/screens/post/PostSettings';
import CommentDetail from '~/screens/post/CommentDetail';

const homeScreens = {
  'post-detail': PostDetail,
  'create-post': CreatePost,
  'create-comment': CreateComment,
  'post-select-audience': PostSelectAudience,
  'post-select-image': PostSelectImage,
  'draft-post': DraftPost,
  'user-profile': UserProfile,
  'post-settings': PostSettings,
  'comment-detail': CommentDetail,
};

export default homeScreens;
