import streamApi from '~/api/StreamApi';
import { IReorderArticles } from '~/interfaces/ISeries';
import usePostsStore from '~/store/entities/posts';
import { ISeriesState } from '..';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

const navigation = withNavigation(rootNavigationRef);

export const reorderArticles = (set, _) => async (id: string, indexArticlesOrder: number[]) => {
  try {
    const series = usePostsStore.getState().posts[id];
    const { articles } = series;
    const lstIdArticlesReordered = indexArticlesOrder.map((index) => articles[index].id);

    set((state: ISeriesState) => {
      state.loading = true;
    }, 'reorderArticles loading');

    const body: IReorderArticles = {
      articleIds: lstIdArticlesReordered,
    };
    const response = await streamApi.reorderArticles(id, body);

    if (!response.data) {
      throw new Error(
        'Response not correct',
      );
    }

    const lstArticlesReordered = indexArticlesOrder.map((index) => articles[index]);
    const newSeries = {
      ...series,
      articles: lstArticlesReordered,
    };
    usePostsStore.getState().actions.addToPosts({ data: newSeries });

    set((state: ISeriesState) => {
      state.loading = false;
    }, 'reorderArticles success');

    showToastSuccess(response, 'series:reorder_successful');

    navigation.goBack();
  } catch (e) {
    set((state: ISeriesState) => {
      state.loading = false;
    }, 'reorderArticles error');

    showToastError(e);
  }
};
