import { IPostActivity } from '~/interfaces/IPost';
import homeTypes from './types';
import {
  IParamGetRecentSearchKeywords,
  IPayloadGetHomePost,
  IPayloadGetSearchPosts,
  IPayloadSetNewsfeedSearch,
  IPayloadSetNewsfeedSearchFilter,
  IPayloadSetNewsfeedSearchRecentKeywords,
  IPayloadSetNewsfeedSearchUsers,
  IRecentSearchTarget,
} from '~/interfaces/IHome';

const homeActions = {
  setLoadingHomePosts: (payload: boolean) => ({
    type: homeTypes.SET_LOADING_HOME_POSTS,
    payload,
  }),
  setRefreshingHomePosts: (payload: boolean) => ({
    type: homeTypes.SET_REFRESHING_HOME_POSTS,
    payload,
  }),
  setNoMoreHomePosts: (payload: boolean) => ({
    type: homeTypes.SET_NO_MORE_HOME_POSTS,
    payload,
  }),

  setHomePosts: (payload: IPostActivity) => ({
    type: homeTypes.SET_HOME_POSTS,
    payload,
  }),

  setNewsfeedSearch: (payload: IPayloadSetNewsfeedSearch) => ({
    type: homeTypes.SET_NEWSFEED_SEARCH,
    payload,
  }),
  setNewsfeedSearchFilter: (payload: IPayloadSetNewsfeedSearchFilter) => ({
    type: homeTypes.SET_NEWSFEED_SEARCH_FILTER,
    payload,
  }),
  clearNewsfeedSearchFilter: () => ({
    type: homeTypes.CLEAR_NEWSFEED_SEARCH_FILTER,
  }),
  setNewsfeedSearchUsers: (payload: IPayloadSetNewsfeedSearchUsers) => ({
    type: homeTypes.SET_NEWSFEED_SEARCH_USERS,
    payload,
  }),
  setNewsfeedSearchRecentKeywords: (payload: IPayloadSetNewsfeedSearchRecentKeywords) => ({
    type: homeTypes.SET_NEWSFEED_SEARCH_RECENT_KEYWORDS,
    payload,
  }),
  clearAllNewsfeedSearch: () => ({
    type: homeTypes.CLEAR_ALL_NEWSFEED_SEARCH,
  }),

  // FOR SAGA:
  getHomePosts: (payload: IPayloadGetHomePost) => ({
    type: homeTypes.GET_HOME_POSTS,
    payload,
  }),

  getSearchPosts: (payload?: IPayloadGetSearchPosts) => ({
    type: homeTypes.GET_SEARCH_POSTS,
    payload,
  }),
  getSearchUsers: (payload?: string) => ({
    type: homeTypes.GET_SEARCH_POSTS_USERS,
    payload,
  }),
  getRecentSearchKeywords: (payload?: IParamGetRecentSearchKeywords) => ({
    type: homeTypes.GET_RECENT_SEARCH_KEYWORDS,
    payload,
  }),
  deleteClearRecentSearch: (payload: IRecentSearchTarget) => ({
    type: homeTypes.DELETE_CLEAR_RECENT_SEARCH_KEYWORDS,
    payload,
  }),
  deleteRecentSearchById: (payload: string) => ({
    type: homeTypes.DELETE_RECENT_SEARCH_KEYWORD_BY_ID,
    payload,
  }),
};

export default homeActions;
