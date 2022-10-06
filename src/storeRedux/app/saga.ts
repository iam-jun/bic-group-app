import { put, takeEvery, takeLatest } from 'redux-saga/effects';
import { timeOut } from '~/utils/common';
import actions from './actions';
import types from './constants';
import groupApi from '~/api/GroupApi';
import showError from '../commonSaga/showError';

export default function* saga() {
  yield takeLatest(
    types.GET_CONFIGS, getConfigs,
  );
  yield takeEvery(
    types.GET_LINK_PREVIEW, getLinkPreview,
  );
  yield takeLatest(
    types.SET_SHOW_ERROR, showError,
  );
  // yield takeLatest(types.SETUP_PUSH_TOKEN, setupPushToken);
  // yield takeLatest(types.COPY_DEVICE_TOKEN, copyDeviceToken);
}

function* getConfigs() {
  try {
    // [FIXME] Should be removed when API ready for use
    yield timeOut(1000);
    // const response: IObject<any> = yield call(api.getConfigs);
    // yield put(actions.setConfigs(response));
  } catch (err) {
    console.error(
      'getConfigs', { err },
    );
  }
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

// function* setupPushToken() {
//   try {
//     // Get Firebase token
//     yield messaging().deleteToken();
//     const deviceToken: string = yield messaging().getToken();
//     // Push token firebase
//     yield makePushTokenRequest(deviceToken);
//   } catch (e) {
//     console.log('setupPushToken fail:', e);
//   }
// }

// function* copyDeviceToken() {
// const deviceToken: string = yield messaging().getToken();
// console.log('deviceToken', deviceToken);
// Clipboard.setString(deviceToken);
// alert(`Copied\n\n ${deviceToken}`);
// }
