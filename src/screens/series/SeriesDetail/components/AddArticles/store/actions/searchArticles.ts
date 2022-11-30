import streamApi from '~/api/StreamApi';
import appConfig from '~/configs/appConfig';
import { IGetSearchArticleInSeries } from '~/interfaces/IArticle';
import showError from '~/store/helper/showError';
import { IAddArticlesState } from '..';

const searchArticles = (set, get) => async (params: IGetSearchArticleInSeries, isLoadMore?: boolean) => {
  try {
    const { items, hasNextPage }: IAddArticlesState = get() || {};
    if (!!isLoadMore && !hasNextPage) {
      return;
    }

    set((state: IAddArticlesState) => {
      state.loading = true;
      state.key = params.contentSearch || '';
    }, 'searchArticleInSeries');
    const newParams: IGetSearchArticleInSeries = {
      ...params,
      offset: isLoadMore ? items.length : 0,
      limit: appConfig.articlesInSeriesLimit,
    };

    const response = await streamApi.searchArticleInSeries(newParams);
    const newList = isLoadMore ? [...items, ...response?.data?.list || []] : response?.data?.list || [];

    set((state: IAddArticlesState) => {
      state.loading = false;
      state.items = newList;
      state.hasNextPage = newList.length < (response?.data?.meta?.total || 0);
    }, 'searchArticleInSeriesSuccess');
  } catch (e) {
    set((state: IAddArticlesState) => {
      state.loading = false;
    }, 'searchArticleInSeriesFailed');
    console.error('\x1b[35m🐣️ searchArticleInSeries error: ', e, '\x1b[0m');
    showError(e);
  }
};

export default searchArticles;
