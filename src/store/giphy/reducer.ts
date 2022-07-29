import types from './constants';

export const giphyInitState = {
  APIKey: null,
};

/**
 * Video reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(
  state = giphyInitState, action: any = {},
) {
  const { type, payload } = action;

  switch (type) {
    case types.SET_API_KEY:
      return {
        ...state,
        APIKey: payload,
      };
    default:
      return state;
  }
}
export default reducer;
