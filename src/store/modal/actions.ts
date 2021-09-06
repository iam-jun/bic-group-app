// flow
import * as Actions from './constants';
import {IShowAlert} from '../../interfaces/IModal';
import {IToastMessage} from '~/interfaces/common';

/**
 * Fetch settings
 * @returns {{type: string}}
 */
export function fetchSetting() {
  return {
    type: Actions.FETCH_SETTING,
  };
}

/**
 * Show Alert
 * @returns {{type: string}}
 */

export function showAlert(payload: IShowAlert) {
  return {
    type: Actions.SHOW_ALERT,
    payload,
  };
}

/**
 * Hide Alert
 * @returns {{type: string}}
 */

export function hideAlert() {
  return {
    type: Actions.HIDE_ALERT,
  };
}

export const showHideToastMessage = (payload: IToastMessage) => ({
  type: Actions.SHOW_HIDE_TOAST_MESSAGE,
  payload,
});

export const setToastMessage = (payload: IToastMessage) => ({
  type: Actions.SET_TOAST_MESSAGE,
  payload,
});

export const clearToastMessage = () => ({
  type: Actions.CLEAR_TOAST_MESSAGE,
});

export const focusSearchInput = (payload: string) => ({
  type: Actions.FOCUS_SEARCH_INPUT,
  payload,
});
