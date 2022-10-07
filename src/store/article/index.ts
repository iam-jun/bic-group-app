import {
  resetStore,
  createStore,
} from '~/store/utils';
import { IArticlesState } from './Interface';
import getArticleDetail from './actions/getArticleDetail';

const initialState = {
  items: {},
  requestings: {},

};

const articleStore = (set, get) => ({
  ...initialState,
  actions: {
    getArticleDetail: getArticleDetail(set, get),
  },
  reset: () => resetStore(initialState, set),
});

const useArticleStore = createStore<IArticlesState>(articleStore);

export default useArticleStore;
