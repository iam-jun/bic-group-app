import { PostType } from '~/interfaces/IPost';
import { withNavigation } from '~/router/helper';
import articleStack from '~/router/navigator/MainStack/stacks/articleStack/stack';
import homeStack from '~/router/navigator/MainStack/stacks/homeStack/stack';
import { rootNavigationRef } from '~/router/refs';

export const getTitle = (type: PostType) => {
  const newType = type?.toUpperCase();
  if (newType === PostType.ARTICLE) {
    return 'post:title_comment_detail_of_article';
  }
  return 'post:title_comment_detail_of_post';
};

export const replacePostDetail = (type: PostType, postId: string) => {
  const rootNavigation = withNavigation(rootNavigationRef);
  if (type === PostType.ARTICLE) {
    rootNavigation.replace(articleStack.articleDetail, {
      articleId: postId || 0,
    });
  } else {
    rootNavigation.replace(homeStack.postDetail, {
      post_id: postId || 0,
    });
  }
};
