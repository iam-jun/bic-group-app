import types from './types';

const noInternetActions = {
  setIsInternetReachable: (payload: boolean) => ({
    type: types.SET_IS_INTERNET_REACHABLE,
    payload,
  }),

  setSystemIssue: (payload: boolean) => ({
    type: types.SET_SYSTEM_ISSUE,
    payload,
  }),

  showSystemIssue: () => ({
    type: types.SHOW_SYSTEM_ISSUE,
  }),

  hideSystemIssue: () => ({
    type: types.HIDE_SYSTEM_ISSUE,
  }),
};

export default noInternetActions;
