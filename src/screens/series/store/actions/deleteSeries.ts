import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';

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
      useModalStore.getState().actions.showToast({ content: 'series:text_delete_series_success' });
    }
  } catch (error) {
    if (error?.meta?.errors?.groups_denied) {
      callbackError?.(error.meta.errors.groups_denied);
    } else showToastError(error);
    console.error('delete series error', error);
  }
};

export default deleteSeries;
