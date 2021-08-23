import messaging from '@react-native-firebase/messaging';
import {Clipboard} from 'react-native';
import {put, takeLatest} from 'redux-saga/effects';

import {IHeaderFlashMessage} from '~/interfaces/common';
import {makePushTokenRequest} from '~/services/httpApiRequest';
import {
  clearHeaderFlashMessage,
  setHeaderFlashMessage,
} from '~/store/app/actions';
import * as types from './constants';

function timeOut(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function* saga() {
  yield takeLatest(types.GET_CONFIGS, getConfigs);
  yield takeLatest(types.SETUP_PUSH_TOKEN, setupPushToken);
  yield takeLatest(types.COPY_DEVICE_TOKEN, copyDeviceToken);
  yield takeLatest(types.SHOW_HEADER_FLASH_MESSAGE, showHeaderFlashMessage);
}

function* getConfigs() {
  try {
    //[FIXME] Should be removed when API ready for use
    yield timeOut(1000);
    // const response: IObject<any> = yield call(api.getConfigs);
    // yield put(actions.setConfigs(response));
  } catch (err) {
    console.log('getConfigs', {err});
  }
}

function* setupPushToken() {
  try {
    // Get Firebase token
    const deviceToken: string = yield messaging().getToken();
    // Push token firebase
    yield makePushTokenRequest(deviceToken);
  } catch (e) {
    console.log('setupPushToken fail:', e);
  }
}

function* copyDeviceToken() {
  const deviceToken: string = yield messaging().getToken();
  console.log('deviceToken', deviceToken);
  Clipboard.setString(deviceToken);
  alert(`Copied\n\n ${deviceToken}`);
}

function* showHeaderFlashMessage({
  payload,
}: {
  type: string;
  payload: IHeaderFlashMessage;
}) {
  yield put(setHeaderFlashMessage(payload));
  yield timeOut(payload?.duration || 5000);
  yield put(clearHeaderFlashMessage());
}

export {setupPushToken};
