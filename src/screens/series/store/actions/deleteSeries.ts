import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import showToastError from '~/store/helper/showToastError';
import showToast from '~/store/helper/showToast';

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
      showToast({ content: 'series:text_delete_series_success' });
    }
  } catch (error) {
    if (error?.meta?.errors?.groupsDenied) {
      callbackError?.(error.meta.errors.groupsDenied);
    } else showToastError(error);
    console.error('delete series error', error);
  }
};

export default deleteSeries;
