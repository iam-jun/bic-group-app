import { createStore, resetStore } from '~/store/utils';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import searchUsers from './actions/searchUsers';
import { ISearchUser } from '~/interfaces/ISearch';

export type SearchUser = {
  groupId: string;
  key: string;
  loading: boolean;
  items: ISearchUser[];
  hasNextPage: boolean;
};

export interface ISearchFilterUsersState extends IBaseState {
  search: SearchUser;
  selected: ISearchUser[];
  actions: {
    updateSelectedUsers: (users: ISearchUser[]) => void;
    setSearchUser: (search: Partial<SearchUser>) => void;
    searchUsers: (contentSearch?: string, isRefresh?: boolean) => void;
  };
}

const initialState: InitStateType<ISearchFilterUsersState> = {
  search: {
    groupId: '',
    key: '',
    loading: false,
    items: [],
    hasNextPage: true,
  },
  selected: [],
};

const searchFilterUsersStore = (set, get) => ({
  ...initialState,

  actions: {
    updateSelectedUsers: (users: ISearchUser[]) => {
      set((state: ISearchFilterUsersState) => {
        state.selected = [...users];
      }, 'updateSelectedUsers');
    },
    setSearchUser: (search: Partial<SearchUser>) => {
      set((state: ISearchFilterUsersState) => {
        state.search = {
          ...state.search,
          ...search,
        };
      }, 'setSearchUser');
    },
    searchUsers: searchUsers(set, get),
  },

  reset: () => resetStore(initialState, set),
});

const useSearchFilterUsersStore
  = createStore<ISearchFilterUsersState>(searchFilterUsersStore);

export default useSearchFilterUsersStore;
