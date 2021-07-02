import {takeLatest} from 'redux-saga/effects';

import * as types from './constants';

function timeOut(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function* saga() {
  yield takeLatest(types.GET_CONFIGS, getConfigs);
}

function* getConfigs() {
  try {
    //[FIXME] Should be removed when API ready for use
    yield timeOut(1000);
    // const response: IObject<any> = yield call(api.getConfigs);
    // yield put(actions.setConfigs(response));
  } catch (err) {
    console.log('getConfigs', {err});
  } finally {
  }
}
