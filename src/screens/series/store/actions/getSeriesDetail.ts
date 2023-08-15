import streamApi from '~/api/StreamApi';
import { IParamGetSeriesDetail } from '~/interfaces/ISeries';
import usePostsStore from '~/store/entities/posts';
import { ISeriesState } from '..';

const getSeriesDetail = (set, get) => async (id: string) => {
  if (!id) return;
  const { requestings }: ISeriesState = get() || {};
  if (requestings[id]) return;

  set((state) => { state.requestings[id] = true; }, 'requestingGetSeriesDetail');
  try {
    const params = { withComment: true, commentLimit: 10 } as IParamGetSeriesDetail;
    const response = await streamApi.getSeriesDetail(id, params);
    const data = response?.data;

    set((state) => {
      delete state.requestings[id];
      state.errors[id] = false;
    }, 'getSeriesDetailSuccess');

    usePostsStore.getState().actions.addToPosts({ data });
  } catch (error) {
    set((state: ISeriesState) => {
      delete state.requestings[id];
      state.errors[id] = true;
    }, 'getSeriesDetailError');
    console.error('getSeriesDetailError', error);
  }
};

export default getSeriesDetail;
