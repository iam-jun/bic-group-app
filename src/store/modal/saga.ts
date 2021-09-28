import {put, select, takeLatest} from 'redux-saga/effects';
import {get} from 'lodash';

import {IPayloadShowModal, IToastMessage} from '~/interfaces/common';
import modalActions, {clearToastMessage, setToastMessage} from './actions';
import * as types from './constants';
import modalKeySelector from '~/store/modal/keySelector';

function timeOut(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function* commonSaga() {
  yield takeLatest(types.SHOW_MODAL, showModal);
  yield takeLatest(types.SHOW_HIDE_TOAST_MESSAGE, showAndHideToastMessage);
}

function* showModal({payload}: {type: string; payload: IPayloadShowModal}) {
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
