import audienceTypes from './constants';

export const initState = {
  audiences: {
    data: [],
  },
};

function reducer(state = initState, action: any = {}) {
  const {type, payload} = action;
  const {audiences} = state;

  switch (type) {
    case audienceTypes.GET_AUDIENCES:
      return {
        ...state,
        audiences: {
          ...audiences,
        },
      };

    case audienceTypes.SET_AUDIENCES:
      return {
        ...state,
        audiences: {
          ...audiences,
          data: payload,
        },
      };

    default:
      return state;
  }
}

export default reducer;
