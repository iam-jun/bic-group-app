import {put, takeLatest} from 'redux-saga/effects';

import {IToastMessage} from '~/interfaces/common';
import {clearToastMessage, setToastMessage} from './actions';
import * as types from './constants';

function timeOut(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function* commonSaga() {
  yield takeLatest(types.SHOW_HIDE_TOAST_MESSAGE, showAndHideToastMessage);
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
