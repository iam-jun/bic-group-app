import * as actions from './constants';

export const initState = {
  loading: false,
  user: null,
};

/**
 * auth reducer
 * @param state
 * @param action
 * @returns {*}
 */
function authReducer(state = initState, action: any = {}) {
  const {type} = action;
  switch (type) {
    case actions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case actions.SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
export default authReducer;
