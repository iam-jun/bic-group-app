import types from './constants';

export const initState = {
  configs: {},
  linkPreviews: {},
};

/**
 * Video reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(state = initState, action: any = {}) {
  const {type, payload} = action;
  const {configs} = state;

  switch (type) {
    case types.SET_CONFIGS:
      return {
        ...state,
        configs: {
          ...configs,
        },
      };
    case types.SET_LINK_PREVIEW:
      return {
        ...state,
        linkPreviews: {
          ...state.linkPreviews,
          [payload?.url]: payload,
        },
      };
    default:
      return state;
  }
}
export default reducer;
