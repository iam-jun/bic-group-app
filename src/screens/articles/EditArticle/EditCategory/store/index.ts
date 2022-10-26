import getSearchCategories from './actions/getSearchCategories';
import getCategories from './actions/getCategories';
import { createStore, resetStore } from '~/store/utils';

export interface IEditArticleCategoryState {
  categories: {
    loading: boolean;
    items: any;
    hasNextPage: boolean;
  },
  search: {
    key: string;
    loading: boolean;
    items: any;
  },
  actions: {
    getCategories: (isLoadMore?: boolean, params?: any) => void;
    getSearchCategories: (key: string) => void;
  }
}

const initialState = {
  categories: {
    loading: false,
    items: undefined,
    hasNextPage: true,
  },
  search: {
    key: '',
    loading: false,
    items: [],
  },
  selecting: [],
};

const useEditArticleCategory = (set, get) => ({
  ...initialState,

  actions: {
    getCategories: getCategories(set, get),
    getSearchCategories: getSearchCategories(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useEditArticleCategoryStore = createStore<IEditArticleCategoryState>(useEditArticleCategory);

export default useEditArticleCategoryStore;
