import i18next from 'i18next';
import streamApi from '~/api/StreamApi';
import { IReorderArticles } from '~/interfaces/ISeries';
import usePostsStore from '~/store/entities/posts';
import { ISeriesState } from '..';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import { IToastMessage } from '~/interfaces/common';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';

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

    const toastMessage: IToastMessage = {
      content: response?.meta?.message || i18next.t('series:reorder_successful'),
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));

    navigation.goBack();
  } catch (e) {
    set((state: ISeriesState) => {
      state.loading = false;
    }, 'reorderArticles error');

    const toastMessage: IToastMessage = {
      content: e?.meta?.message || i18next.t('series:reorder_failed'),
      props: { type: 'error' },
    };
    Store.store.dispatch(modalActions.showHideToastMessage(toastMessage));
  }
};
