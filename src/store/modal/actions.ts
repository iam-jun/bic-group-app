// flow
import * as Actions from './constants';
import {IShowAlert} from '../../interfaces/IModal';

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
