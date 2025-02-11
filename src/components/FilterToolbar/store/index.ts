import { createStore, resetStore } from '~/store/utils';
import IBaseState from '~/store/interfaces/IBaseState';
import searchPostUsers from './actions/searchPostUsers';
import { PostType } from '~/interfaces/IPost';

export type SearchUser = {
  groupId: string;
  key: string;
  loading: boolean;
  items: any[];
  hasNextPage: boolean;
};

export interface IFilterToolbarState extends IBaseState {
  postType: any;
  createdBy: any;
  datePosted: any;
  search: SearchUser;
  actions: {
    setFilterPostType: (postType: PostType) => void;
    setFilterCreateBy: (createdBy: 'me' | undefined | any) => void;
    setFilterDatePosted: (date: any) => void;
    setSearchUser: (search: Partial<SearchUser>) => void;
    searchPostUsers: (contentSearch?: string, isLoadMore?: boolean) => void;
  };
}

const initialState = {
  postType: undefined,
  createdBy: undefined,
  datePosted: undefined,
  search: {
    groupId: '',
    key: '',
    loading: false,
    items: [],
    hasNextPage: true,
  },
};

const useFilterToolbar = (set, get) => ({
  ...initialState,

  actions: {
    setFilterPostType: (postType: PostType) => {
      set((state: IFilterToolbarState) => {
        state.postType = postType;
      }, 'setFilterPostType');
    },
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
    setSearchUser: (search: Partial<SearchUser>) => {
      set((state: IFilterToolbarState) => {
        state.search = {
          ...state.search,
          ...search,
        };
      }, 'setSearchUser');
    },
    searchPostUsers: searchPostUsers(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useFilterToolbarStore
  = createStore<IFilterToolbarState>(useFilterToolbar);

export default useFilterToolbarStore;
