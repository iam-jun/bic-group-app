import { createStore, resetStore } from '~/store/utils';
import IBaseState from '~/store/interfaces/IBaseState';
import getPostUsers from './actions/getPostUsers';
import searchPostUsers from './actions/searchPostUsers';

export interface IFilterToolbarState extends IBaseState {
  createdBy: any,
  datePosted: any,
  listUser: {
    loading: boolean;
    items: any[];
    hasNextPage: boolean;
  },
  search: {
    key: string;
    loading: boolean;
    items: any[];
    hasNextPage: boolean;
  },
  actions: {
    setFilterCreateBy: (createdBy: 'me' | undefined | any)=> void;
    setFilterDatePosted: (date: any) => void;
    getPostUsers: (isLoadMore?: boolean) => void;
    searchPostUsers: (contentSearch: string, isLoadMore?: boolean) => void;
  }
}

const initialState = {
  createdBy: undefined,
  datePosted: undefined,
  listUser: {
    loading: false,
    items: [],
    hasNextPage: true,
  },
  search: {
    key: '',
    loading: false,
    items: [],
    hasNextPage: true,
  },
};

const useFilterToolbar = (set, get) => ({
  ...initialState,

  actions: {
    setFilterCreateBy: (createdBy: 'me' | undefined | any) => {
      set((state: IFilterToolbarState) => {
        state.createdBy = createdBy;
      }, 'setCreatedBy');
    },
    setFilterDatePosted: (date: any) => {
      set((state: IFilterToolbarState) => {
        state.datePosted = date;
      }, 'setDatePosted');
    },
    getPostUsers: getPostUsers(set, get),
    searchPostUsers: searchPostUsers(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useFilterToolbarStore = createStore<IFilterToolbarState>(useFilterToolbar);

export default useFilterToolbarStore;
