import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showError from '~/store/helper/showError';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';

const deleteSeries = (_set, _get) => async (id: string, callbackError: any) => {
  if (!id) return;

  try {
    const response = await streamApi.deleteSeries(id);
    if (response?.data) {
      const post = usePostsStore.getState()?.posts?.[id] || {};
      const deletedSeries = {
        ...post,
        deleted: true,
      };
      usePostsStore.getState().actions.addToPosts({ data: deletedSeries } as IPayloadAddToAllPost);
      Store.store.dispatch(modalActions.showHideToastMessage({ content: 'series:text_delete_series_success' }));
    }
  } catch (error) {
    if (error?.meta?.errors?.groups_denied) {
      callbackError?.(error.meta.errors.groups_denied);
    } else showError(error);
    console.error('delete series error', error);
  }
};

export default deleteSeries;
