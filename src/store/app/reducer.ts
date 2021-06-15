import * as types from './constants';

export const initState = {
  configs: {},
};

/**
 * Video reducer
 * @param state
 * @param action
 * @returns {*}
 */
function reducer(state = initState, action: any = {}) {
  const {type} = action;
  const {configs} = state;

  switch (type) {
    case types.SET_CONFIGS:
      return {
        ...state,
        configs: {
          ...configs,
        },
      };
    default:
      return state;
  }
}
export default reducer;
