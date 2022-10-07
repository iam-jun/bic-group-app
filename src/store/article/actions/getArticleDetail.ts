import streamApi from '~/api/StreamApi';
import { IArticlesState } from '../Interface';

const getArticleDetail = (set, get) => async (id: string) => {
  const { requestings }: IArticlesState = get();

  if (requestings[id]) return;

  set((state) => { state.requestings[id] = true; });

  // const params = {
  //   offset: ids.length,
  //   limit: 20,
  // };

  try {
    const response = await streamApi.getArticleDetail(id);
    const data = response?.data;
    // const { list, meta } = data || {};

    set((state) => {
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
