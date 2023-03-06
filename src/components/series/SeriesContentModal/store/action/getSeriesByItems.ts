import streamApi from '~/api/StreamApi';
import { ISeriesContentModalState } from '..';
import showToastError from '~/store/helper/showToastError';
import { IGetSeries } from '~/interfaces/ISeries';
import { timeOut } from '~/utils/common';

const getSeriesByItems = (set, get) => async (payload: IGetSeries) => {
  try {
    const { series }: ISeriesContentModalState = get();
    const { data: listSeries, loading, hasNextPage } = series;

    if (loading || !hasNextPage) return;

    set((state: ISeriesContentModalState) => {
      state.series.loading = true;
    }, 'getSeriesByItems');

    const params = {
      ...payload,
      offset: listSeries?.length,
    };
    const response = await streamApi.searchSeries(params);
    await timeOut(300);
    const newSeries = listSeries?.concat(response?.data?.list || []);

    set((state: ISeriesContentModalState) => {
      state.series.data = newSeries;
      state.series.loading = false;
      state.series.hasNextPage = listSeries?.length < (response?.data?.meta?.total || 0);
    }, 'getSeriesByItems Success');
  } catch (e) {
    console.error('\x1b[35m🐣️ getSeriesByItems error: ', e, '\x1b[0m');
    set((state: ISeriesContentModalState) => {
      state.series.loading = false;
    }, 'getSeriesByItems error');
    showToastError(e);
  }
};

export default getSeriesByItems;
