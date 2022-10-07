import UserProfile from '~/screens/Menu/UserProfile';
import CommentDetail from '~/screens/post/CommentDetail';
import { ArticleDetail } from '~/screens/articles';

const articleScreens = {
  'article-detail': ArticleDetail,
  'user-profile': UserProfile,
  'comment-detail': CommentDetail,
};

export default articleScreens;
