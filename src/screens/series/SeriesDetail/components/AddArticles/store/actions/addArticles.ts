import streamApi from '~/api/StreamApi';
import { IPostArticles } from '~/interfaces/IPost';
import useSeriesStore from '~/screens/series/store';
import showToastError from '~/store/helper/showToastError';
import showToast from '~/store/helper/showToast';
import { IAddArticlesState } from '..';

const addArticles = (_set, get) => async (seriesId: string, article: IPostArticles) => {
  if (!seriesId || !article) return;
  try {
    const { actions }: IAddArticlesState = get() || {};
    await streamApi.addArticleInSeries(seriesId, { itemIds: [article.id] });
    actions.setSelectingArticle(article);
    useSeriesStore.getState().actions.getSeriesDetail(seriesId);
    showToast({ content: 'series:text_add_articles_success' });
  } catch (error) {
    showToastError(error);
  }
};

export default addArticles;
