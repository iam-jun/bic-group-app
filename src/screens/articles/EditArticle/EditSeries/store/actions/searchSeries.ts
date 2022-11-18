import streamApi from '~/api/StreamApi';
import { IEditArticleSeriesState } from '..';
import showError from '~/store/helper/showError';
import { IGetSeries } from '~/interfaces/ISeries';

const searchSeries = (set, _get) => async (params: IGetSeries) => {
  set((state: IEditArticleSeriesState) => {
    state.search.loading = true;
    state.search.key = params?.contentSearch || '';
  }, 'searchSeries');
  try {
    const response = await streamApi.searchSeries(params);

    set((state: IEditArticleSeriesState) => {
      state.search.loading = false;
      state.search.items = response?.data?.list || [];
    }, 'searchSeriesSuccess');
  } catch (e) {
    set((state: IEditArticleSeriesState) => {
      state.search.loading = false;
    }, 'searchSeriesFailed');
    console.error('\x1b[35m🐣️ searchSeries error: ', e, '\x1b[0m');
    showError(e);
  }
};

export default searchSeries;
