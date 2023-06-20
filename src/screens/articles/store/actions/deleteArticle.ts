import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import useDraftArticleStore from '~/screens/YourContent/components/Draft/DraftArticle/store';
import useDraftContentsStore from '~/screens/YourContent/components/Draft/DraftContents/store';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import showToastSuccess from '~/store/helper/showToastSuccess';

const deleteArticle = (_set, _get) => async (id: string) => {
  if (!id) {
    console.warn('\x1b[31m🐣️ deleteArticle: id not found\x1b[0m');
    return;
  }

  try {
    const response = await streamApi.deleteArticle(id);

    const post = usePostsStore.getState()?.posts?.[id] || {};
    const deletedPost = {
      ...post,
      deleted: true,
    };
    usePostsStore.getState().actions.addToPosts({ data: deletedPost } as IPayloadAddToAllPost);
    useDraftArticleStore.getState().actions.getDraftArticles({ isRefresh: true });
    useDraftContentsStore.getState().actions.getDraftContents({ isRefresh: true });
    showToastSuccess(response);
  } catch (error) {
    console.error('deleteArticle error:', error);
    showToastError(error);
  }
};

export default deleteArticle;
