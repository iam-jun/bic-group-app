import postTypes from './constants';

export const initState = {
  posts: {
    loading: false,
    data: [],
  },
};

function reducer(state = initState, action: any = {}) {
  const {type, payload} = action;
  const {posts} = state;

  switch (type) {
    case postTypes.SET_POSTS:
      return {
        ...state,
        posts: {
          ...posts,
          loading: false,
          data: payload,
        },
      };

    default:
      return state;
  }
}

export default reducer;
