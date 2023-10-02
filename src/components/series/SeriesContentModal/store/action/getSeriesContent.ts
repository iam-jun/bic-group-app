import streamApi from '~/api/StreamApi';
import { ISeriesContentModalState } from '..';
import showToastError from '~/store/helper/showToastError';
import { timeOut } from '~/utils/common';

const getSeriesContent = (set, get) => async (contentId: string) => {
  try {
    const { series }: ISeriesContentModalState = get();
    const { loading } = series;

    if (loading || !contentId) return;

    set((state: ISeriesContentModalState) => {
      state.series.loading = true;
    }, 'getSeriesContent');

    const response = await streamApi.getSeriesContent(contentId);
    await timeOut(300);

    set((state: ISeriesContentModalState) => {
      state.series.data = response?.data?.list || [];
      state.series.loading = false;
    }, 'getSeriesContent Success');
  } catch (e) {
    console.error('\x1b[35m🐣️ getSeriesContent error: ', e, '\x1b[0m');
    set((state: ISeriesContentModalState) => {
      state.series.loading = false;
    }, 'getSeriesContent error');
    showToastError(e);
  }
};

export default getSeriesContent;
