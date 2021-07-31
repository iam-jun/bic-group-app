import homeTypes from './types';

const initialHomeState = {
  loadingHomePosts: false,
  homePosts: [],
};

const homeReducer = (state = initialHomeState, action: any = {}) => {
  const {type, payload} = action;

  switch (type) {
    case homeTypes.SET_LOADING_HOME_POSTS:
      return {
        ...state,
        loadingHomePosts: payload,
      };

    case homeTypes.SET_HOME_POSTS:
      return {
        ...state,
        homePosts: payload || [],
      };

    default:
      return state;
  }
};

export default homeReducer;
