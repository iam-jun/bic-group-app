import types from './constants';

export const appInitState = {
  configs: {},
  linkPreviews: {},
  rootScreenName: '',
  drawerVisible: false,
  debuggerVisible: false,
};

/**
 * Video reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(
  state = appInitState, action: any = {},
) {
  const { type, payload } = action;
  const { configs } = state;

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
    case types.SET_DRAWER_VISIBLE:
      return {
        ...state,
        drawerVisible: payload,
      };
    case types.SET_DEBUGGER_VISIBLE:
      return {
        ...state,
        debuggerVisible: payload,
      };
    default:
      return state;
  }
}
export default reducer;
