import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import useDraftArticleStore from '~/screens/YourContent/components/Draft/DraftArticle/store';
import usePostsStore from '~/store/entities/posts';
import showToast from '~/store/helper/showToast';
import showToastError from '~/store/helper/showToastError';

const deleteArticle = (_set, _get) => async (id: string, successMessage = 'post:draft:text_draft_deleted') => {
  if (!id) {
    console.warn('\x1b[31m🐣️ deleteArticle: id not found\x1b[0m');
    return;
  }

  try {
    const response = await streamApi.deleteArticle(id);

    if (response.data) {
      const post = usePostsStore.getState()?.posts?.[id] || {};
      const deletedPost = {
        ...post,
        deleted: true,
      };
      usePostsStore.getState().actions.addToPosts({ data: deletedPost } as IPayloadAddToAllPost);
      useDraftArticleStore.getState().actions.getDraftArticles({ isRefresh: true });
      showToast({ content: successMessage });
    }
  } catch (error) {
    console.error('deleteArticle error:', error);
    showToastError(error);
  }
};

export default deleteArticle;
