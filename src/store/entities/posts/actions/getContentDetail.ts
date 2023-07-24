import { PostType } from '~/interfaces/IPost';
import { IPostsState } from '..';
import useArticlesStore from '~/screens/articles/ArticleDetail/store';

const getContentDetail = (_set, get) => (contentId: string) => {
  try {
    const { posts, actions: actionsPostsStore }: IPostsState = get();
    const { type } = posts[contentId] || {};

    if (!type) {
      throw new Error('type is not defined');
    }

    if (type === PostType.POST) {
      actionsPostsStore.getPostDetail({ postId: contentId });
    }

    if (type === PostType.ARTICLE) {
      useArticlesStore.getState().actions.getArticleDetail({ articleId: contentId });
    }
  } catch (error) {
    console.error('getContentDetail error', error);
  }
};

export default getContentDetail;
