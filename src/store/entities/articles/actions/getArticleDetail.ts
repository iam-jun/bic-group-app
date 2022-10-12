import streamApi from '~/api/StreamApi';
import { IArticlesState } from '..';

const getArticleDetail = (set, get) => async (id: string) => {
  const { requestings }: IArticlesState = get();

  if (requestings[id]) return;

  set((state) => { state.requestings[id] = true; }, 'getArticleDetail');

  try {
    const response = await streamApi.getArticleDetail(id);
    const data = response?.data;

    set((state) => {
      delete state.requestings[id];
      state.items[id] = data;
    }, 'getArticleDetail');
  } catch (error) {
    set((state) => {
      delete state.requestings[id];
    }, 'getArticles');
    console.error('getArticleDetail', error);
  }
};

export default getArticleDetail;
