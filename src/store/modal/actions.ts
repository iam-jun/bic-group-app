// flow
import * as Actions from './constants';
import {
  IPayloadReactionDetailBottomSheet,
  IShowAlert,
} from '~/interfaces/IModal';
import {IPayloadShowModal, IToastMessage} from '~/interfaces/common';
import {ReactionType} from '~/constants/reactions';

export function setModal(payload: IPayloadShowModal) {
  return {
    type: Actions.SET_MODAL,
    payload,
  };
}

export function showModal(payload: IPayloadShowModal) {
  return {
    type: Actions.SHOW_MODAL,
    payload,
  };
}

export function hideModal() {
  return {
    type: Actions.HIDE_MODAL,
  };
}

export function fetchSetting() {
  return {
    type: Actions.FETCH_SETTING,
  };
}

export function showAlert(payload: IShowAlert) {
  return {
    type: Actions.SHOW_ALERT,
    payload,
  };
}

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

export const setUserProfilePreviewBottomSheet = (payload: {
  isOpen?: boolean;
  userId?: number;
  position?: {x: number; y: number};
}) => ({
  type: Actions.SET_USER_PROFILE_PREVIEW_BOTTOM_SHEET,
  payload,
});

export const showUserProfilePreviewBottomSheet = (payload: {
  userId?: number;
  position?: {x: number; y: number};
}) => ({
  type: Actions.SHOW_USER_PROFILE_PREVIEW_BOTTOM_SHEET,
  payload,
});

export const hideUserProfilePreviewBottomSheet = () => ({
  type: Actions.HIDE_USER_PROFILE_PREVIEW_BOTTOM_SHEET,
});

const modalActions = {
  setModal,
  showModal,
  hideModal,
  fetchSetting,
  showAlert,
  hideAlert,
  showAlertNewFeature,
  hideAlertNewFeature,
  showLoading,
  hideLoading,
  showHideToastMessage,
  setToastMessage,
  clearToastMessage,
  focusSearchInput,
  showReactionDetailBottomSheet,
  clearReactionDetailBottomSheet,
  setShowReactionBottomSheet,
  setUserProfilePreviewBottomSheet,
  showUserProfilePreviewBottomSheet,
  hideUserProfilePreviewBottomSheet,
};
export default modalActions;
