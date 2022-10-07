import {
  resetStore,
  createStore,
} from '~/store/utils';
import { IArticleListState } from './Interface';
import getArticles from './actions/getArticles';

const initialState = {
  ids: [],
  loading: false,
  hasNextPage: true,
};

const articleListStore = (set, get) => ({
  ...initialState,
  actions: {
    getArticles: getArticles(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useArticleListStore = createStore<IArticleListState>(articleListStore);

export default useArticleListStore;
