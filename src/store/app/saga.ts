import {all, put, call, takeLatest} from 'redux-saga/effects';

import * as types from './constants';
import * as actions from './actions';
import * as api from './api';
import * as refNavigator from '~/utils/refNavigator';
import {rootSwitch} from '~/configs/navigator';
import {IObject} from '~/interfaces/common';

/**
 * Videos
 * @param payload
 * @returns {IterableIterator<*>}
 */

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function* saga() {
  yield takeLatest(types.GET_CONFIGS, getConfigs);
}

function* getConfigs() {
  try {
    //[FIXME] Should be removed when API ready for use
    yield timeout(1000);
    // const response: IObject<any> = yield call(api.getConfigs);
    // yield put(actions.setConfigs(response));
  } catch (err) {
    console.log('getConfigs', {err});
  } finally {
  }
}
