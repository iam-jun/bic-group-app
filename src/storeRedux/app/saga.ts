import { put, takeEvery } from 'redux-saga/effects';
import actions from './actions';
import types from './constants';
import groupApi from '~/api/GroupApi';

export default function* saga() {
  yield takeEvery(
    types.GET_LINK_PREVIEW, getLinkPreview,
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
