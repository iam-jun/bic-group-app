import streamApi from '~/api/StreamApi';
import { ISelectSeriesState } from '..';
import showToastError from '~/store/helper/showToastError';
import { IGetSeries } from '~/interfaces/ISeries';

const searchSeries = (set, _get) => async (params: IGetSeries) => {
  set((state: ISelectSeriesState) => {
    state.search.loading = true;
    state.search.key = params?.contentSearch || '';
  }, 'searchSeries');
  try {
    const response = await streamApi.searchSeries(params);

    set((state: ISelectSeriesState) => {
      state.search.loading = false;
      state.search.items = response?.data?.list || [];
    }, 'searchSeriesSuccess');
  } catch (e) {
    set((state: ISelectSeriesState) => {
      state.search.loading = false;
    }, 'searchSeriesFailed');
    console.error('\x1b[35m🐣️ searchSeries error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default searchSeries;
