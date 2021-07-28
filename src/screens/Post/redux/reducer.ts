import postTypes from './types';

const initState = {
  createPost: {
    loading: false,
    data: {
      content: '',
      images: [],
      videos: [],
      files: [],
    },
    chosenAudiences: [],
  },
  postDetail: {},
};

function postReducer(state = initState, action: any = {}) {
  const {type, payload} = action;

  switch (type) {
    case postTypes.SET_LOADING_CREATE_POST:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          loading: payload,
        },
      };
    case postTypes.CLEAR_CREATE_POST:
      return {
        ...state,
        createPost: initState.createPost,
      };
    case postTypes.SET_CREATE_POST_DATA:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          data: payload,
        },
      };
    case postTypes.SET_CREATE_POST_CHOSEN_AUDIENCES:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          chosenAudiences: payload,
        },
      };
    case postTypes.SET_POST_DETAIL:
      return {
        ...state,
        postDetail: payload,
      };
    default:
      return state;
  }
}

export default postReducer;
