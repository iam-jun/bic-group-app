import streamApi from '~/api/StreamApi';
import { IRelatedContentsInSeriesState } from '..';

const getContentsInSeries = (set, get) => async (seriesIds: string[]) => {
  try {
    const { isLoading }: IRelatedContentsInSeriesState = get();

    if (isLoading || !seriesIds) return;

    set((state: IRelatedContentsInSeriesState) => {
      state.isLoading = true;
    });

    const res = await streamApi.getContentsInSeries(seriesIds);

    if (!res || !res.data) {
      throw new Error('Wrong response');
    }

    set((state: IRelatedContentsInSeriesState) => {
      state.isLoading = false;
      state.data = res.data.series || [];
    });
  } catch (e) {
    console.error('\x1b[35m🐣️ getContentsInSeries error: ', e, '\x1b[0m');
    set((state: IRelatedContentsInSeriesState) => {
      state.isLoading = false;
    });
  }
};

export default getContentsInSeries;
