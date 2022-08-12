import CreateComment from '~/screens/Post/CreateComment';
import CreatePost from '~/screens/Post/CreatePost';
import PostDetail from '~/screens/Post/PostDetail';
import PostSelectAudience from '~/screens/Post/PostSelectAudience';
import PostSelectImage from '~/screens/Post/PostSelectImage';
import DraftPost from '~/screens/Post/DraftPost';
import UserProfile from '~/screens/Menu/UserProfile';
import PostSettings from '~/screens/Post/PostSettings';
import CommentDetail from '~/screens/Post/CommentDetail';

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
}

export default homeScreens;
