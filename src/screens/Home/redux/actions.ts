import {IPostActivity} from '~/interfaces/IPost';
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
  setLoadingHomePosts: (payload: boolean) => {
    return {
      type: homeTypes.SET_LOADING_HOME_POSTS,
      payload,
    };
  },
  setRefreshingHomePosts: (payload: boolean) => {
    return {
      type: homeTypes.SET_REFRESHING_HOME_POSTS,
      payload,
    };
  },
  setNoMoreHomePosts: (payload: boolean) => {
    return {
      type: homeTypes.SET_NO_MORE_HOME_POSTS,
      payload,
    };
  },

  setHomePosts: (payload: IPostActivity) => {
    return {
      type: homeTypes.SET_HOME_POSTS,
      payload,
    };
  },

  setNewsfeedSearch: (payload: IPayloadSetNewsfeedSearch) => {
    return {
      type: homeTypes.SET_NEWSFEED_SEARCH,
      payload,
    };
  },
  setNewsfeedSearchFilter: (payload: IPayloadSetNewsfeedSearchFilter) => {
    return {
      type: homeTypes.SET_NEWSFEED_SEARCH_FILTER,
      payload,
    };
  },
  clearNewsfeedSearchFilter: () => {
    return {
      type: homeTypes.CLEAR_NEWSFEED_SEARCH_FILTER,
    };
  },
  setNewsfeedSearchUsers: (payload: IPayloadSetNewsfeedSearchUsers) => {
    return {
      type: homeTypes.SET_NEWSFEED_SEARCH_USERS,
      payload,
    };
  },
  setNewsfeedSearchRecentKeywords: (
    payload: IPayloadSetNewsfeedSearchRecentKeywords,
  ) => {
    return {
      type: homeTypes.SET_NEWSFEED_SEARCH_RECENT_KEYWORDS,
      payload,
    };
  },
  clearAllNewsfeedSearch: () => {
    return {
      type: homeTypes.CLEAR_ALL_NEWSFEED_SEARCH,
    };
  },

  // FOR SAGA:
  getHomePosts: (payload: IPayloadGetHomePost) => {
    return {
      type: homeTypes.GET_HOME_POSTS,
      payload,
    };
  },

  getSearchPosts: (payload?: IPayloadGetSearchPosts) => {
    return {
      type: homeTypes.GET_SEARCH_POSTS,
      payload,
    };
  },
  getSearchUsers: (payload?: string) => {
    return {
      type: homeTypes.GET_SEARCH_POSTS_USERS,
      payload,
    };
  },
  getRecentSearchKeywords: (payload?: IParamGetRecentSearchKeywords) => {
    return {
      type: homeTypes.GET_RECENT_SEARCH_KEYWORDS,
      payload,
    };
  },
  deleteClearRecentSearch: (payload: IRecentSearchTarget) => {
    return {
      type: homeTypes.DELETE_CLEAR_RECENT_SEARCH_KEYWORDS,
      payload,
    };
  },
  deleteRecentSearchById: (payload: string) => {
    return {
      type: homeTypes.DELETE_RECENT_SEARCH_KEYWORD_BY_ID,
      payload,
    };
  },
};

export default homeActions;
