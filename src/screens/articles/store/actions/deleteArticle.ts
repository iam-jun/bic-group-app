import streamApi from '~/api/StreamApi';
import { IPayloadDeleteArticle } from '~/interfaces/IArticle';
import useDraftArticleStore from '~/screens/Draft/DraftArticle/store';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';

const deleteArticle = (_set, _get) => async (payload: IPayloadDeleteArticle) => {
  const { id, isDraft } = payload;

  if (!id) {
    console.warn('\x1b[31m🐣️ deleteArticle: id not found\x1b[0m');
    return;
  }

  try {
    const response = await streamApi.deleteArticle(id, isDraft);

    if (response.data) {
      useModalStore.getState().actions.showToast({ content: 'post:draft:text_draft_deleted' });
      useDraftArticleStore.getState().actions.getDraftArticles({ isRefresh: true });
    }
  } catch (error) {
    console.error('deleteArticle error:', error);
    showToastError(error);
  }
};

export default deleteArticle;
