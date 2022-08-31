// flow
import * as Actions from './constants';
import {
  IPayloadReactionDetailBottomSheet,
  IShowAlert,
} from '~/interfaces/IModal';
import {
  IObject,
  IPayloadShowModal,
  IToastMessage,
  IUserPreview,
} from '~/interfaces/common';
import { ReactionType } from '~/constants/reactions';
import { BottomListProps } from '~/components/BottomList';

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

export const showReactionDetailBottomSheet = (payload: IPayloadReactionDetailBottomSheet) => ({
  type: Actions.SHOW_REACTION_DETAIL_BOTTOM_SHEET,
  payload,
});

export const clearReactionDetailBottomSheet = () => ({
  type: Actions.CLEAR_REACTION_DETAIL_BOTTOM_SHEET,
});

export const setShowReactionBottomSheet = (payload?: {
  visible?: boolean;
  title?: string;
  callback?: (reactionId: ReactionType) => void;
}) => ({
  type: Actions.SET_SHOW_REACTION_BOTTOM_SHEET,
  payload,
});

export const setUserProfilePreviewBottomSheet = (payload: IUserPreview) => ({
  type: Actions.SET_USER_PROFILE_PREVIEW_BOTTOM_SHEET,
  payload,
});

export const showUserProfilePreviewBottomSheet = (payload: {
  userId?: string;
  params?: IObject<any>;
  position?: {x: number; y: number};
}) => ({
  type: Actions.SHOW_USER_PROFILE_PREVIEW_BOTTOM_SHEET,
  payload,
});

export const hideUserProfilePreviewBottomSheet = () => ({
  type: Actions.HIDE_USER_PROFILE_PREVIEW_BOTTOM_SHEET,
});

export const showSeenPeopleListBottomSheet = () => ({
  type: Actions.SHOW_SEEN_PEOPLE_LIST_BOTTOM_SHEET,
});

export const showBottomList = (payload: BottomListProps) => ({
  type: Actions.SHOW_BOTTOM_LIST,
  payload,
});

export const setBottomList = (payload:BottomListProps) => ({
  type: Actions.SET_BOTTOM_LIST,
  payload,
});

export const hideBottomList = () => ({
  type: Actions.HIDE_BOTTOM_LIST,
});

const modalActions = {
  setModal,
  showModal,
  hideModal,
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
  showSeenPeopleListBottomSheet,
  showBottomList,
  setBottomList,
  hideBottomList,
};
export default modalActions;
