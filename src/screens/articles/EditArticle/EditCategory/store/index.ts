import getCategories from './actions/getCategories';
import { createStore, resetStore } from '~/store/utils';

export interface IEditArticleCategoryState {
  categories: {
    loading: boolean,
    items: any
  },
  actions: {
    getCategories: (isLoadMore?: boolean, params?: any) => void;
  }
}

const initialState = {
  categories: {
    loading: false,
    items: undefined,
  },
  selecting: [],
};

const useEditArticleCategory = (set, get) => ({
  ...initialState,

  actions: {
    getCategories: getCategories(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useEditArticleCategoryStore = createStore<IEditArticleCategoryState>(useEditArticleCategory);

export default useEditArticleCategoryStore;
