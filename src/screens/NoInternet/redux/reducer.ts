import types from './types';

export const noInternetInitState = {
  /**
   * User our isInternetReachable instead of NetInfo because:
   *  - NetInfo.isInternetReachable may be null when first defined
   *  - Sometimes when there is no Internet and not connected to any network
   *    it may return {
   *      isConnected: false.
   *      isInternetReachable: true
   *    }
   *    => which we do not want
   * Set default to true as for first time accessing the app
   */
  isInternetReachable: true,
  systemIssue: false,
};

function noInternetReducer(state = noInternetInitState, action: any = {}) {
  const { type, payload } = action;
  switch (type) {
    case types.SET_IS_INTERNET_REACHABLE:
      return {
        ...state,
        isInternetReachable: payload,
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
