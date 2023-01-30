import streamApi from '~/api/StreamApi';
import { IPostArticles } from '~/interfaces/IPost';
import useSeriesStore from '~/screens/series/store';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';
import { IAddArticlesState } from '..';

const addArticles = (_set, get) => async (seriesId: string, article: IPostArticles) => {
  if (!seriesId || !article) return;
  try {
    const { actions }: IAddArticlesState = get() || {};
    const response = await streamApi.addArticleInSeries(seriesId, { articleIds: [article.id] });
    actions.setSelectingArticle(article);
    useSeriesStore.getState().actions.getSeriesDetail(seriesId);
    showToastSuccess(response);
  } catch (error) {
    showToastError(error);
  }
};

export default addArticles;
