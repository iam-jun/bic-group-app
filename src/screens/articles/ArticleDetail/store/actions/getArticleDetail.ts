import streamApi from '~/api/StreamApi';
import { IParamGetArticleDetail } from '~/interfaces/IArticle';
import usePostsStore from '~/store/entities/posts';
import { IArticlesState } from '..';

const getArticleDetail = (set, get) => async (id: string) => {
  const { requestings }: IArticlesState = get();

  if (requestings[id]) return;

  set((state) => { state.requestings[id] = true; }, 'requestingGetArticleDetail');

  try {
    const params = { withComment: true, commentLimit: 10 } as IParamGetArticleDetail;
    const response = await streamApi.getArticleDetail(id, params);
    const data = response?.data;
    set((state) => {
      delete state.requestings[id];
      state.errors[id] = false;
    }, 'getArticlesSuccess');

    usePostsStore.getState().actions.addToPosts({ data, handleComment: true });
  } catch (error) {
    set((state) => {
      delete state.requestings[id];
      state.errors[id] = true;
    }, 'getArticlesError');
    console.error('getArticleDetail', error);
  }
};

export default getArticleDetail;
