import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import actions from './actions';
import types from './constants';
import groupApi from '~/api/GroupApi';
import showError from '../commonSaga/showError';

export default function* saga() {
  yield takeEvery(
    types.GET_LINK_PREVIEW, getLinkPreview,
  );
  yield takeLatest(
    types.SET_SHOW_ERROR, showError,
  );
}

function* getLinkPreview({ payload }: {type: string; payload: string}) {
  try {
    const response = yield groupApi.getLinkPreview(payload);
    yield put(actions.setLinkPreview(response?.data));
  } catch (err: any) {
    console.error(
      'getLinkPreview', err,
    );
  }
}
