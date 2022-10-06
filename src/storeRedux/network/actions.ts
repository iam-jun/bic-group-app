import types from './types';

const noInternetActions = {
  setIsInternetReachable: (payload: boolean) => ({
    type: types.SET_IS_INTERNET_REACHABLE,
    payload,
  }),

  checkInternetReachable: () => ({
    type: types.CHECK_IS_INTERNET_REACHABLE,
  }),

  setSystemIssue: (payload: boolean) => ({
    type: types.SET_SYSTEM_ISSUE,
    payload,
  }),

  showSystemIssueThenLogout: () => ({
    type: types.SHOW_SYSTEM_ISSUE_THEN_LOGOUT,
  }),
};

export default noInternetActions;
