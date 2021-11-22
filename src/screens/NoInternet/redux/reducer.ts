import * as types from './types';

const initDataState = {
  noInternet: false,
  systemIssue: false,
};

function noInternetReducer(state = initDataState, action: any = {}) {
  const {type, payload} = action;
  switch (type) {
    case types.SET_NO_INTERNET:
      return {
        ...state,
        noInternet: payload,
      };
    case types.SET_SYSTEM_ISSUE:
      return {
        ...state,
        systemIssue: payload,
      };
    default:
      return state;
  }
}

export default noInternetReducer;
