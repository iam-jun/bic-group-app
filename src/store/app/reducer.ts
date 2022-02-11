import types from './constants';

export const appInitState = {
  configs: {},
  linkPreviews: {},
  rootScreenName: '',
};

/**
 * Video reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(state = appInitState, action: any = {}) {
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
    case types.SET_ROOT_SCREEN_NAME:
      return {
        ...state,
        rootScreenName: payload,
      };
    default:
      return state;
  }
}
export default reducer;
