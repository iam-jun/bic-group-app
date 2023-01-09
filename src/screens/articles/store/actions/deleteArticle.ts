import streamApi from '~/api/StreamApi';
import useDraftArticleStore from '~/screens/Draft/DraftArticle/store';
import showToastError from '~/store/helper/showToastError';
import showToast from '~/store/helper/showToast';

const deleteArticle = (_set, _get) => async (id: string) => {
  if (!id) {
    console.warn('\x1b[31m🐣️ deleteArticle: id not found\x1b[0m');
    return;
  }

  try {
    const response = await streamApi.deleteArticle(id);

    if (response.data) {
      showToast({ content: 'post:draft:text_draft_deleted' });
      useDraftArticleStore.getState().actions.getDraftArticles({ isRefresh: true });
    }
  } catch (error) {
    console.error('deleteArticle error:', error);
    showToastError(error);
  }
};

export default deleteArticle;
