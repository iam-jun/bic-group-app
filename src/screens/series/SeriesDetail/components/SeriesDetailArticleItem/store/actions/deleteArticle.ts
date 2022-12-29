import streamApi from '~/api/StreamApi';
import { IRemoveArticleInSeries } from '~/interfaces/ISeries';
import useSeriesStore from '~/screens/series/store';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';

const deleteArticle = (_set, _get) => async (seriesId: string, articleId: string) => {
  if (!seriesId || !articleId) return;
  try {
    const body: IRemoveArticleInSeries = {
      articleIds: [articleId],
    };
    const response = await streamApi.removeArticleFromSeriesDetail(seriesId, body);
    if (!!response) {
      useSeriesStore.getState().actions.getSeriesDetail(seriesId);
      useModalStore.getState().actions.showToast({ content: 'series:text_article_removed' });
    }
  } catch (error) {
    console.error('\x1b[31m🐣️ deleteArticle error: \x1b[0m', error);
    showToastError(error);
  }
};

export default deleteArticle;
