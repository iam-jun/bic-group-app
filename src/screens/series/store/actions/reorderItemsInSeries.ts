import streamApi from '~/api/StreamApi';
import { IReorderItems } from '~/interfaces/ISeries';
import usePostsStore from '~/store/entities/posts';
import { ISeriesState } from '..';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const navigation = withNavigation?.(rootNavigationRef);

export const reorderItemsInSeries = (set, _) => async (id: string, indexItemsOrder: number[]) => {
  try {
    const series = usePostsStore.getState().posts[id];
    const { items } = series;
    const lstIdItemsReordered = indexItemsOrder.map((index) => items[index].id);

    set((state: ISeriesState) => {
      state.loading = true;
    }, 'reorderItemsInSeries loading');

    const body: IReorderItems = {
      itemIds: lstIdItemsReordered,
    };
    const response = await streamApi.reorderItemsInSeries(id, body);

    if (!response.data) {
      throw new Error(
        'Response not correct',
      );
    }

    const lstItemsReordered = indexItemsOrder.map((index) => items[index]);
    const newSeries = {
      ...series,
      items: lstItemsReordered,
    };
    usePostsStore.getState().actions.addToPosts({ data: newSeries });

    set((state: ISeriesState) => {
      state.loading = false;
    }, 'reorderItemsInSeries success');

    showToastSuccess(response, 'series:reorder_successful');

    navigation.goBack();
  } catch (e) {
    set((state: ISeriesState) => {
      state.loading = false;
    }, 'reorderItemsInSeries error');

    showToastError(e);
  }
};
