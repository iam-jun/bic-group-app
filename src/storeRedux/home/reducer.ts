import homeTypes from './types';

export const homeInitState = {
  newsfeedSearch: {
    isShow: false,
    searchText: '',
    isSuggestion: true,
    loadingSuggestion: false,
    loadingResult: false,
    totalResult: -1,
    suggestionResults: [],
    searchResults: [],
  },
  newsfeedSearchRecentKeyword: {
    loading: true,
    data: [],
  },
};

const homeReducer = (
  state = homeInitState, action: any = {},
) => {
  const { type, payload } = action;

  switch (type) {
    case homeTypes.SET_NEWSFEED_SEARCH:
      return {
        ...state,
        newsfeedSearch: {
          ...state.newsfeedSearch,
          ...payload,
        },
      };
    case homeTypes.SET_NEWSFEED_SEARCH_RECENT_KEYWORDS:
      return {
        ...state,
        newsfeedSearchRecentKeyword: {
          ...state.newsfeedSearchRecentKeyword,
          ...payload,
        },
      };
    case homeTypes.CLEAR_ALL_NEWSFEED_SEARCH:
      return {
        ...state,
        newsfeedSearch: homeInitState.newsfeedSearch,
        newsfeedSearchRecentKeyword: homeInitState.newsfeedSearchRecentKeyword,
      };

    default:
      return state;
  }
};

export default homeReducer;
