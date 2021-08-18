import * as types from './constants';

export const initState = {
  configs: {},
  headerFlashMessage: {
    content: '',
    props: {},
  },
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
    case types.SET_HEADER_FLASH_MESSAGE:
      return {
        ...state,
        headerFlashMessage: payload,
      };
    case types.CLEAR_HEADER_FLASH_MESSAGE:
      return {
        ...state,
        headerFlashMessage: initState.headerFlashMessage,
      };
    default:
      return state;
  }
}
export default reducer;
