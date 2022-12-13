import streamApi from '~/api/StreamApi';
import { IRemoveArticleInSeries } from '~/interfaces/ISeries';
import useSeriesStore from '~/screens/series/store';
import showError from '~/store/helper/showError';
import modalActions from '~/storeRedux/modal/actions';
import Store from '~/storeRedux';

const deleteArticle = (_set, _get) => async (seriesId: string, articleId: string) => {
  if (!seriesId || !articleId) return;
  try {
    const body: IRemoveArticleInSeries = {
      articleIds: [articleId],
    };
    const response = await streamApi.removeArticleFromSeriesDetail(seriesId, body);
    if (!!response) {
      useSeriesStore.getState().actions.getSeriesDetail(seriesId);
      Store.store.dispatch(modalActions.showHideToastMessage({ content: 'series:text_article_removed' }));
    }
  } catch (error) {
    console.error('\x1b[31m🐣️ deleteArticle error: \x1b[0m', error);
    showError(error);
  }
};

export default deleteArticle;
