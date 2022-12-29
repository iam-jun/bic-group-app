import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import { ISeriesState } from '..';
import showToastError from '~/store/helper/showToastError';
import useModalStore from '~/store/modal';

const removeAudiences = (_set, get) => async (id: string, listAudiences: string[]) => {
  if (!id) return;
  const { actions }: ISeriesState = get() || {};
  const series = usePostsStore.getState().posts?.[id] || {};

  const payload = {
    ...series,
    audience: {
      userIds: [],
      groupIds: listAudiences,
    },
  };
  try {
    const response = await streamApi.editSeries(id, payload);
    actions.getSeriesDetail(id);
    if (!!response?.data) {
      usePostsStore.getState().actions.addToPosts({ data: response.data } as IPayloadAddToAllPost);
      useModalStore.getState().actions.showToast({ content: 'series:text_deleted_audiences' });
    }
  } catch (error) {
    showToastError(error);
    console.error('removeAudiencesError', error);
  }
};

export default removeAudiences;
