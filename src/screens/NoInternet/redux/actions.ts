import types from './types';

export function setNoInternet(payload: boolean) {
  return {
    type: types.SET_NO_INTERNET,
    payload,
  };
}

export function setSystemIssue(payload: boolean) {
  return {
    type: types.SET_SYSTEM_ISSUE,
    payload,
  };
}

export function showSystemIssue() {
  return {
    type: types.SHOW_SYSTEM_ISSUE,
  };
}

export function hideSystemIssue() {
  return {
    type: types.HIDE_SYSTEM_ISSUE,
  };
}
