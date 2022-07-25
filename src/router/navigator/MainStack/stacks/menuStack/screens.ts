import Menu from '~/screens/Menu';
import ComponentCollection from '~/screens/Menu/ComponentCollection';
import AccoutSettings from '~/screens/Menu/AccountSettings';
import SecurityLogin from '~/screens/Menu/AccountSettings/SecurityLogin';
import ChangePassword from '~/screens/Menu/AccountSettings/SecurityLogin/ChangePassword';
import PostSelectAudience from '~/screens/Post/PostSelectAudience';
import PostSelectImage from '~/screens/Post/PostSelectImage';
import PostDetail from '~/screens/Post/PostDetail';
import DraftPost from '~/screens/Post/DraftPost';
import CreatePost from '~/screens/Post/CreatePost';
import CreateComment from '~/screens/Post/CreateComment';
import UserProfile from '~/screens/Menu/UserProfile';
import PostSettings from '~/screens/Post/PostSettings';
import CommentDetail from '~/screens/Post/CommentDetail';

const menuScreens = {
  menu: Menu,
  'component-collection': ComponentCollection,
  'account-settings': AccoutSettings,
  'security-and-login': SecurityLogin,
  'change-password': ChangePassword,
  'user-profile': UserProfile,

  // use for draft post
  'create-post': CreatePost,
  'create-comment': CreateComment,
  'post-select-audience': PostSelectAudience,
  'post-select-image': PostSelectImage,
  'post-detail': PostDetail,
  'draft-post': DraftPost,
  'post-settings': PostSettings,
  'comment-detail': CommentDetail,
}

export default menuScreens;
