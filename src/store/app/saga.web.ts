import {put, takeLatest} from 'redux-saga/effects';
import * as types from './constants';
import {IHeaderFlashMessage} from '~/interfaces/common';
import {
  clearHeaderFlashMessage,
  setHeaderFlashMessage,
} from '~/store/app/actions';

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
  yield console.log('web is not supported');
}

function* copyDeviceToken() {
  yield console.log('web is not supported');
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
