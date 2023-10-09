import { IPost } from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import {
  IParamGetRecentSearchKeywords,
  IRecentSearchKeywordItem,
  IRecentSearchTarget,
  ISearch,
  ISearchFilter,
  PayloadSearchContent,
  UpdateSearchData,
} from '~/interfaces/ISearch';
import getRecentSearchKeywords from './actions/getRecentSearchKeywords';
import isFilterChangedByScreenKey from './actions/isFilterChangedByScreenKey';
import deleteRecentSearchById from './actions/deleteRecentSearchById';
import deleteRecentSearchAll from './actions/deleteRecentSearchAll';
import searchContent from './actions/searchContent';
import saveRecentSearchKeywords from './actions/saveRecentSearchKeywords';

export interface ISearchState extends IBaseState {
  content: {
    [id: string]: IPost;
  };
  recentSearchKeyword: {
    loading: boolean;
    data: IRecentSearchKeywordItem[];
  };
  search: {
    [screenKey: string]: ISearch;
  };
  actions: {
    addToContent: (posts: IPost[]) => void;
    initSearchDataByScreenKey: (screenKey: string) => void;
    removeSearchDataByScreenKey: (screenKey: string) => void;
    updateSearchDataByScreenKey: (
      screenKey: string,
      searchData: UpdateSearchData
    ) => void;
    initTempFilterByScreenKey: (screenKey: string) => void;
    removeTempFilterByScreenKey: (screenKey: string) => void;
    updateTempFilterByScreenKey: (
      screenKey: string,
      tempFilter: ISearchFilter
    ) => void;
    isFilterChangedByScreenKey: (screenKey: string) => boolean;
    saveRecentSearchKeywords: (searchText: string) => void;
    getRecentSearchKeywords: (params: IParamGetRecentSearchKeywords) => void;
    deleteRecentSearchById: (id: string) => void;
    deleteRecentSearchAll: (target: IRecentSearchTarget) => void;
    searchContent: (payload: PayloadSearchContent) => void;
  };
}

export const initState: InitStateType<ISearchState> = {
  content: {},
  recentSearchKeyword: {
    loading: false,
    data: [],
  },
  search: {},
};

const searchStore = (set, get): ISearchState => ({
  ...initState,
  actions: {
    addToContent: (posts: IPost[]) => {
      set((state: ISearchState) => {
        posts.forEach((post) => {
          state.content[post.id] = post;
        });
      }, 'addToContent');
    },
    initSearchDataByScreenKey: (screenKey: string) => {
      set((state: ISearchState) => {
        state.search[screenKey] = {
          searchText: '',
          isSuggestion: true,
          loadingResult: false,
          hasNextPage: true,
          endCursor: null,
          searchResults: [],
          totalResults: 0,
          filter: {},
        };
      }, 'initSearchDataByScreenKey');
    },
    removeSearchDataByScreenKey: (screenKey: string) => {
      set((state: ISearchState) => {
        delete state.search[screenKey];
      }, 'removeSearchDataByScreenKey');
    },
    updateSearchDataByScreenKey: (
      screenKey: string,
      searchData: UpdateSearchData,
    ) => {
      set((state: ISearchState) => {
        state.search[screenKey] = {
          ...state.search[screenKey],
          ...searchData,
        };
      }, 'updateSearchDataByScreenKey');
    },
    initTempFilterByScreenKey: (screenKey: string) => {
      set((state: ISearchState) => {
        state.search[screenKey] = {
          ...state.search[screenKey],
          tempFilter: {
            ...state.search[screenKey]?.filter,
          },
        };
      }, 'initTempFilterByScreenKey');
    },
    removeTempFilterByScreenKey: (screenKey: string) => {
      set((state: ISearchState) => {
        if (!!state.search[screenKey]) {
          delete state.search[screenKey].tempFilter;
        }
      }, 'removeTempFilterByScreenKey');
    },
    updateTempFilterByScreenKey: (
      screenKey: string,
      tempFilter: ISearchFilter,
    ) => {
      set((state: ISearchState) => {
        state.search[screenKey] = {
          ...state.search[screenKey],
          tempFilter: {
            ...state.search[screenKey]?.tempFilter,
            ...tempFilter,
          },
        };
      }, 'updateTempFilterByScreenKey');
    },
    isFilterChangedByScreenKey: isFilterChangedByScreenKey(set, get),
    saveRecentSearchKeywords: saveRecentSearchKeywords(set, get),
    getRecentSearchKeywords: getRecentSearchKeywords(set, get),
    deleteRecentSearchById: deleteRecentSearchById(set, get),
    deleteRecentSearchAll: deleteRecentSearchAll(set, get),
    searchContent: searchContent(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useSearchStore = createStore<ISearchState>(searchStore);

export default useSearchStore;
