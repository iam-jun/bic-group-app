import {all, put, call, takeLatest} from 'redux-saga/effects';

import {IObject} from '~/interfaces/common';
import * as types from './constants';
import * as actions from './actions';
import * as api from './api';
import {IParams} from '~/utils/withParams';
import * as refNavigator from '~/utils/refNavigator';
import {rootSwitch} from '~/configs/navigator';

/**
 * Videos
 * @param payload
 * @returns {IterableIterator<*>}
 */

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function* saga() {
  yield takeLatest(types.GET_CONFIGS, getConfigs);
}

function* getConfigs() {
  try {
    yield timeout(1000);
    refNavigator.replace(rootSwitch.mainStack);
  } catch (err) {
    console.log('getConfigs', {err});
  } finally {
  }
}
