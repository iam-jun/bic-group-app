import streamApi from '~/api/StreamApi';
import { IRemoveItemInSeries } from '~/interfaces/ISeries';
import useSeriesStore from '~/screens/series/store';
import showToastError from '~/store/helper/showToastError';
import showToast from '~/store/helper/showToast';

const deleteItemFromSeriesDetail = (_set, _get) => async (seriesId: string, itemId: string) => {
  if (!seriesId || !itemId) return;
  try {
    const body: IRemoveItemInSeries = {
      itemIds: [itemId],
    };
    const response = await streamApi.removeItemFromSeriesDetail(seriesId, body);
    if (response) {
      useSeriesStore.getState().actions.getSeriesDetail(seriesId);
      showToast({ content: 'series:text_article_removed' });
    }
  } catch (error) {
    console.error('\x1b[31m🐣️ deleteItemFromSeriesDetail error: \x1b[0m', error);
    showToastError(error);
  }
};

export default deleteItemFromSeriesDetail;
