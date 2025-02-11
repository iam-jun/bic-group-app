import { PostType } from '~/interfaces/IPost';
import { IPostsState } from '..';
import useArticlesStore from '~/screens/articles/ArticleDetail/store';

const getContentDetail = (_set, get) => (contentId: string, contentType?: PostType) => {
  try {
    const { posts, actions: actionsPostsStore }: IPostsState = get();
    const { type } = posts[contentId] || {};
    const fetchingContentType = contentType || type;

    if (!fetchingContentType) {
      throw new Error('type is not defined');
    }

    if (fetchingContentType === PostType.POST) {
      actionsPostsStore.getPostDetail({ postId: contentId });
    }

    if (fetchingContentType === PostType.ARTICLE) {
      useArticlesStore.getState().actions.getArticleDetail({ articleId: contentId });
    }
  } catch (error) {
    console.error('getContentDetail error', error);
  }
};

export default getContentDetail;
