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
    suggestionResults: [],
    searchResults: [],
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

    default:
      return state;
  }
};

export default homeReducer;
