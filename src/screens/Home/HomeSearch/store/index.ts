import {
  IParamGetRecentSearchKeywords,
  IPayloadGetSearchPosts,
  IPayloadSetNewsfeedSearch,
  IPayloadSetNewsfeedSearchRecentKeywords,
  IRecentSearchTarget,
  RecentSearchKeywordItem,
} from '~/interfaces/IHome';
import { IPost } from '~/interfaces/IPost';
import IBaseState, { InitStateType } from '~/store/interfaces/IBaseState';
import { createStore, resetStore } from '~/store/utils';
import deleteRecentSearchAll from './actions/deleteRecentSearchAll';
import deleteRecentSearchById from './actions/deleteRecentSearchById';
import getRecentSearchKeywords from './actions/getRecentSearchKeywords';
import getSearchPosts from './actions/getSearchPosts';
import saveRecentSearchKeywords from './actions/saveRecentSearchKeywords';

export interface IFeedSearchState extends IBaseState {
  newsfeedSearch: {
    isShow: boolean;
    searchText: string;
    isSuggestion: boolean;
    loadingResult: boolean;
    hasNextPage: boolean;
    searchResults: IPost[];
    groupId: string | undefined;
  };
  newsfeedSearchRecentKeyword: {
    loading: boolean;
    data: RecentSearchKeywordItem[];
  };
  actions: {
    setNewsfeedSearch: (params: IPayloadSetNewsfeedSearch) => void;
    setNewsfeedSearchRecentKeywords: (params: IPayloadSetNewsfeedSearchRecentKeywords) => void;
    getSearchPosts: (params: IPayloadGetSearchPosts) => void;
    saveRecentSearchKeywords: (searchText: string) => void;
    getRecentSearchKeywords: (params: IParamGetRecentSearchKeywords) => void;
    deleteRecentSearchById: (id: string) => void;
    deleteRecentSearchAll: (target: IRecentSearchTarget) => void;
  };
}

export const initState: InitStateType<IFeedSearchState> = {
  newsfeedSearch: {
    isShow: false,
    searchText: '',
    isSuggestion: true,
    loadingResult: false,
    hasNextPage: true,
    searchResults: [],
    groupId: undefined,
  },
  newsfeedSearchRecentKeyword: {
    loading: true,
    data: [],
  },
};

const feedSearchStore = (set, get): IFeedSearchState => ({
  ...initState,
  actions: {
    setNewsfeedSearch: (params: IPayloadSetNewsfeedSearch) => {
      set((state: IFeedSearchState) => {
        state.newsfeedSearch = {
          ...state.newsfeedSearch,
          ...params,
        };
      }, 'setNewsfeedSearch');
    },
    setNewsfeedSearchRecentKeywords: (params: IPayloadSetNewsfeedSearchRecentKeywords) => {
      set((state: IFeedSearchState) => {
        state.newsfeedSearchRecentKeyword = {
          ...state.newsfeedSearchRecentKeyword,
          ...params,
        };
      }, 'setNewsfeedSearchRecentKeywords');
    },
    getSearchPosts: getSearchPosts(set, get),
    saveRecentSearchKeywords: saveRecentSearchKeywords(set, get),
    getRecentSearchKeywords: getRecentSearchKeywords(set, get),
    deleteRecentSearchById: deleteRecentSearchById(set, get),
    deleteRecentSearchAll: deleteRecentSearchAll(set, get),
  },
  reset: () => resetStore(initState, set),
});

const useFeedSearchStore = createStore<IFeedSearchState>(feedSearchStore);

export default useFeedSearchStore;
