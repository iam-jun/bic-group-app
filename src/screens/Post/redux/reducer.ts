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
    audience: {
      users: [0], //todo remove default
      groups: [0], //todo remove default
    },
    tags: [0], //todo remove default
  },
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
    case postTypes.CLEAR_CREATE_POST_DATA:
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
    case postTypes.SET_CREATE_POST_AUDIENCE:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          audience: payload,
        },
      };
    case postTypes.SET_CREATE_POST_TAGS:
      return {
        ...state,
        createPost: {
          ...state.createPost,
          tags: payload,
        },
      };
    default:
      return state;
  }
}

export default postReducer;
