import Newsfeed from '~/screens/Home/Newsfeed';
import PostDetail from '~/screens/Post/PostDetail';
import CreatePost from '~/screens/Post/CreatePost';
import PostSelectAudience from '~/screens/Post/PostSelectAudience';
import PrivateView from '~/screens/Menu/UserProfile/PrivateView';
import PublicView from '~/screens/Menu/UserProfile/PublicView';

export default {
  newsfeed: Newsfeed,
  'post-detail': PostDetail,
  'create-post': CreatePost,
  'post-select-audience': PostSelectAudience,
  'my-profile': PrivateView,
  'public-profile': PublicView,
};
