import streamApi from '~/api/StreamApi';
import useDraftArticleStore from '~/screens/Draft/DraftArticle/store';
import { showHideToastMessage } from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';
import showError from '~/store/helper/showError';

const deleteArticle = (_set, _get) => async (id: string) => {
  if (!id) {
    console.warn('\x1b[31m🐣️ deleteArticle: id not found\x1b[0m');
    return;
  }

  try {
    const response = await streamApi.deleteArticle(id);

    if (response.data) {
      Store.store.dispatch(showHideToastMessage({ content: 'post:draft:text_draft_deleted' }));
      useDraftArticleStore.getState().actions.getDraftArticles({ isRefresh: true });
    }
  } catch (error) {
    console.error('deleteArticle error:', error);
    showError(error);
  }
};

export default deleteArticle;
