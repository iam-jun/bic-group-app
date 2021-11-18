import homeTypes from './types';

const initialHomeState = {
  loadingHomePosts: false,
  refreshingHomePosts: false,
  noMoreHomePosts: false,
  homePosts: [],
  homePostsImportantCount: '',
  newsfeedSearch: {
    isShow: false,
    searchText: '',
    isSuggestion: true,
    loadingSuggestion: false,
    loadingResult: false,
    suggestionResults: [],
    searchResults: [],
  },
  newsfeedSearchFilter: {
    createdBy: undefined,
    date: undefined,
  },
  newsfeedSearchUsers: {
    key: '',
    limit: 10,
    offset: 0,
    data: [],
    loading: false,
    canLoadMore: false,
  },
};

const homeReducer = (state = initialHomeState, action: any = {}) => {
  const {type, payload} = action;

  switch (type) {
    case homeTypes.SET_LOADING_HOME_POSTS:
      return {
        ...state,
        loadingHomePosts: payload,
      };
    case homeTypes.SET_REFRESHING_HOME_POSTS:
      return {
        ...state,
        refreshingHomePosts: payload,
      };
    case homeTypes.SET_NO_MORE_HOME_POSTS:
      return {
        ...state,
        noMoreHomePosts: payload,
      };
    case homeTypes.SET_HOME_POSTS:
      return {
        ...state,
        homePosts: payload || [],
      };
    case homeTypes.SET_NEWSFEED_SEARCH:
      return {
        ...state,
        newsfeedSearch: {
          ...state.newsfeedSearch,
          ...payload,
        },
      };
    case homeTypes.CLEAR_NEWSFEED_SEARCH:
      return {
        ...state,
        newsfeedSearch: initialHomeState.newsfeedSearch,
      };
    case homeTypes.SET_NEWSFEED_SEARCH_FILTER:
      return {
        ...state,
        newsfeedSearchFilter: {
          ...state.newsfeedSearchFilter,
          ...payload,
        },
      };
    case homeTypes.CLEAR_NEWSFEED_SEARCH_FILTER:
      return {
        ...state,
        newsfeedSearchFilter: initialHomeState.newsfeedSearchFilter,
      };
    case homeTypes.SET_NEWSFEED_SEARCH_USERS:
      return {
        ...state,
        newsfeedSearchUsers: {
          ...state.newsfeedSearchUsers,
          ...payload,
        },
      };
    case homeTypes.CLEAR_NEWSFEED_SEARCH_USERS:
      return {
        ...state,
        newsfeedSearchUsers: initialHomeState.newsfeedSearchUsers,
      };

    default:
      return state;
  }
};

export default homeReducer;
