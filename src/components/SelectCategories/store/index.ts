import getSearchCategories from './actions/getSearchCategories';
import getCategories from './actions/getCategories';
import { createStore, resetStore } from '~/store/utils';
import IBaseState from '~/store/interfaces/IBaseState';

export interface ISelectCategoriesState extends IBaseState {
  categories: {
    loading: boolean;
    items: any;
    hasNextPage: boolean;
  };
  search: {
    key: string;
    loading: boolean;
    items: any;
    hasNextPage: boolean;
  };
  selected: any[];
  actions: {
    getCategories: (isLoadMore?: boolean, params?: any) => void;
    getSearchCategories: (key: string) => void;
    updateSelectedCategories: (selectedCategories: any[]) => void;
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
    hasNextPage: true,
  },
  selected: [],
};

const selectCategoriesStore = (set, get) => ({
  ...initialState,

  actions: {
    getCategories: getCategories(set, get),
    getSearchCategories: getSearchCategories(set, get),
    updateSelectedCategories: (selectedCategories: any[]) => {
      set((state: ISelectCategoriesState) => {
        state.selected = selectedCategories;
      });
    },
  },

  reset: () => resetStore(initialState, set),
});

const useSelectCategoriesStore = createStore<ISelectCategoriesState>(selectCategoriesStore);

export default useSelectCategoriesStore;
