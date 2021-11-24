import {put, takeLatest} from 'redux-saga/effects';

import * as actions from './actions';
import types from './types';

export default function* noInternetSaga() {
  yield takeLatest(types.SHOW_SYSTEM_ISSUE, showSystemIssue);
  yield takeLatest(types.HIDE_SYSTEM_ISSUE, hideSystemIssue);
}

function* showSystemIssue() {
  try {
    // TODO: checking if no internet, show banner and stop showing system issue
    yield put(actions.setSystemIssue(true));
  } catch (error) {
    console.log(`error`, error);
  }
}

function* hideSystemIssue() {
  yield put(actions.setSystemIssue(false));
}
