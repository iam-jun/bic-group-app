import streamApi from '~/api/StreamApi';
import usePostsStore from '~/store/entities/posts';
import { ISeriesState } from '..';
import showToastError from '~/store/helper/showToastError';
import showToast from '~/store/helper/showToast';

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
    await streamApi.editSeries(id, payload);
    actions.getSeriesDetail(id);
    showToast({ content: 'series:text_deleted_audiences' });
  } catch (error) {
    showToastError(error);
    console.error('removeAudiencesError', error);
  }
};

export default removeAudiences;
