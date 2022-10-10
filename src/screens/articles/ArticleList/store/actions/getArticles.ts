import streamApi from '~/api/StreamApi';
import useArticlesStore from '~/store/entities/articles';
import { convertArrayToObject } from '~/utils/formatData';
import { IArticleListState } from '../Interface';

const getArticles = (set, get) => async () => {
  const { loading, hasNextPage, ids }: IArticleListState = get();

  if (loading || !hasNextPage) return;

  const params = {
    offset: ids.length,
    limit: 20,
  };
  try {
    set((state) => {
      state.loading = true;
    }, 'getArticleList');

    const response = await streamApi.getArticles(params);
    const data = response?.data;
    const { list, meta } = data || {};
    const newIds = list?.map((item) => item.id);
    const newItems = convertArrayToObject(list);

    set((state) => {
      state.ids = ids.concat(newIds);
      state.loading = true;
      state.hasNextPage = meta?.hasNextPage;
    }, 'getArticleListSuccess');

    const { items } = useArticlesStore.getState();
    useArticlesStore.setState({ items: { ...items, ...newItems } });
  } catch (error) {
    set((state) => {
      state.loading = true;
    }, 'getArticleListFailed');
    console.error('getArticleList', error);
  }
};

export default getArticles;
