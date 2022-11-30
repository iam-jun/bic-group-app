import streamApi from '~/api/StreamApi';
import { ICreateArticleSeriesState } from '..';
import showError from '~/store/helper/showError';
import { IGetSeries } from '~/interfaces/ISeries';

const getSeries = (set, get) => async (isLoadMore :boolean, params?: IGetSeries) => {
  try {
    const listSeries = get().listSeries || {};

    if (isLoadMore && !listSeries.hasNextPage) {
      return;
    }

    set((state: ICreateArticleSeriesState) => {
      state.listSeries.loading = true;
    }, 'getSeries');

    const newParams = {
      ...params,
      offset: isLoadMore ? listSeries?.items?.length : 0,
    };

    const response = await streamApi.searchSeries(newParams);

    const listResult = response?.data?.list || [];
    const series = isLoadMore ? [...listSeries.items, ...listResult] : listResult;
    const hasNextPage = response?.data?.meta?.hasNextPage;

    set((state: ICreateArticleSeriesState) => {
      state.listSeries.loading = false;
      state.listSeries.items = series;
      state.listSeries.hasNextPage = hasNextPage;
    }, 'getSeriesSuccess');
  } catch (e) {
    set((state: ICreateArticleSeriesState) => {
      state.listSeries.loading = false;
    }, 'getSeriesFailed');
    console.error('\x1b[35m🐣️ getSeries error: ', e, '\x1b[0m');
    showError(e);
  }
};

export default getSeries;
