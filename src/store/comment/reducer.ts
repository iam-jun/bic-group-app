import * as types from './constants';

export const initState = {
  comments: {
    loading: false,
    data: [],
  },
};

function reducer(state = initState, action: any = {}) {
  const {type, payload} = action;
  const {comments} = state;

  switch (type) {
    case types.GET_COMMENTS:
      return {
        ...state,
        comments: {
          ...comments,
          loading: true,
        },
      };

    case types.SET_COMMENTS:
      return {
        ...state,
        comments: {
          ...comments,
          loading: false,
          data: payload,
        },
      };

    case types.SEND_COMMENT: {
      return {
        ...state,
        comments: {
          ...comments,
          data: [{...payload, pending: true}, ...comments.data],
        },
      };
    }

    default:
      return state;
  }
}

export default reducer;
