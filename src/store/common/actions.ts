// flow
import * as Actions from './constants';

/**
 * Fetch settings
 * @returns {{type: string}}
 */
export function fetchSetting() {
  return {
    type: Actions.FETCH_SETTING,
  };
}
