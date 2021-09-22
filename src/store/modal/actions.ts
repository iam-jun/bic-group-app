// flow
import * as Actions from './constants';
import {
  IPayloadReactionDetailBottomSheet,
  IShowAlert,
} from '~/interfaces/IModal';
import {IToastMessage} from '~/interfaces/common';
import {ReactionType} from '~/constants/reactions';

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

export function showAlertNewFeature() {
  return {
    type: Actions.SHOW_ALERT_NEW_FEATURE,
  };
}

export function hideAlertNewFeature() {
  return {
    type: Actions.HIDE_ALERT_NEW_FEATURE,
  };
}

export function showLoading() {
  return {
    type: Actions.SHOW_LOADING,
  };
}

export function hideLoading() {
  return {
    type: Actions.HIDE_LOADING,
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

export const showReactionDetailBottomSheet = (
  payload: IPayloadReactionDetailBottomSheet,
) => ({
  type: Actions.SHOW_REACTION_DETAIL_BOTTOM_SHEET,
  payload,
});

export const clearReactionDetailBottomSheet = () => ({
  type: Actions.CLEAR_REACTION_DETAIL_BOTTOM_SHEET,
});

export const setShowReactionBottomSheet = (payload?: {
  show?: boolean;
  title?: string;
  position?: {x: number; y: number};
  side?: 'left' | 'right' | 'center';
  callback?: (reactionId: ReactionType) => void;
}) => ({
  type: Actions.SET_SHOW_REACTION_BOTTOM_SHEET,
  payload,
});
