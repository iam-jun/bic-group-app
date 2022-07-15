import {put, select, takeLatest} from 'redux-saga/effects';
import {get} from 'lodash';

import {
  IPayloadShowModal,
  IToastMessage,
  IUserPreview,
} from '~/interfaces/common';
import modalActions, {
  clearToastMessage,
  setToastMessage,
  setUserProfilePreviewBottomSheet,
} from './actions';
import * as types from './constants';
import modalKeySelector from '~/store/modal/keySelector';

function timeOut(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function* commonSaga() {
  yield takeLatest(types.SHOW_MODAL, showModal);
  yield takeLatest(types.SHOW_HIDE_TOAST_MESSAGE, showAndHideToastMessage);
  yield takeLatest(
    types.SHOW_USER_PROFILE_PREVIEW_BOTTOM_SHEET,
    showUserProfilePreviewBottomSheet,
  );
  yield takeLatest(
    types.HIDE_USER_PROFILE_PREVIEW_BOTTOM_SHEET,
    hideUserProfilePreviewBottomSheet,
  );
}

function* showModal({
  payload,
}: {
  type: string;
  payload: IPayloadShowModal;
}): any {
  const modal = yield select(state => get(state, modalKeySelector.modal));
  const {isOpen} = modal || {};
  if (isOpen) {
    const payload = {isOpen: false, ContentComponent: undefined};
    yield put(modalActions.setModal(payload));
    yield timeOut(200);
  }
  yield put(modalActions.setModal(payload));
}

function* showAndHideToastMessage({
  payload,
}: {
  type: string;
  payload: IToastMessage;
}) {
  yield put(setToastMessage(payload));
  yield timeOut(payload?.duration || 5000);
  yield put(clearToastMessage());
}

function* showUserProfilePreviewBottomSheet({
  payload,
}: {
  type: string;
  payload: IUserPreview;
}) {
  const _payload = {
    isOpen: true,
    ...payload,
  };
  yield put(setUserProfilePreviewBottomSheet(_payload));
}

function* hideUserProfilePreviewBottomSheet() {
  const payload = {
    isOpen: false,
    useId: undefined,
    position: {x: -1, y: -1},
  };
  yield put(setUserProfilePreviewBottomSheet(payload));
}
