import streamApi from '~/api/StreamApi';
import { IPayloadAddToAllPost } from '~/interfaces/IPost';
import usePostsStore from '~/store/entities/posts';
import { ISeriesState } from '..';
import Store from '~/storeRedux';
import modalActions from '~/storeRedux/modal/actions';
import showError from '~/store/helper/showError';

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
      Store.store.dispatch(modalActions.showHideToastMessage({ content: 'series:text_deleted_audiences' }));
    }
  } catch (error) {
    showError(error);
    console.error('removeAudiencesError', error);
  }
};

export default removeAudiences;
