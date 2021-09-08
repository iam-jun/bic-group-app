import Newsfeed from '~/screens/Home/Newsfeed';
import MyProfile from '~/screens/Menu/UserProfile/MyProfile';
import UserProfile from '~/screens/Menu/UserProfile/UserProfile';
import CreateComment from '~/screens/Post/CreateComment';
import CreatePost from '~/screens/Post/CreatePost';
import PostDetail from '~/screens/Post/PostDetail';
import PostSelectAudience from '~/screens/Post/PostSelectAudience';

export default {
  newsfeed: Newsfeed,
  'post-detail': PostDetail,
  'create-post': CreatePost,
  'create-comment': CreateComment,
  'post-select-audience': PostSelectAudience,
  'my-profile': MyProfile, //TODO
  'user-profile': UserProfile, //TODO
};
