import streamApi from '~/api/StreamApi';
import { IPostArticles } from '~/interfaces/IPost';
import useSeriesStore from '~/screens/series/store';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import { IAddArticlesState } from '..';

const addArticles = (_set, get) => async (seriesId: string, article: IPostArticles) => {
  if (!seriesId || !article) return;
  try {
    const { actions }: IAddArticlesState = get() || {};
    await streamApi.addArticleInSeries(seriesId, { articleIds: [article.id] });
    actions.setSelectingArticle(article);
    useSeriesStore.getState().actions.getSeriesDetail(seriesId);
    Store.store.dispatch(modalActions.showHideToastMessage({ content: 'series:text_add_articles_success' }));
  } catch (error) {
    showError(error);
  }
};

export default addArticles;
