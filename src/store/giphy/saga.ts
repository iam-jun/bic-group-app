import {AxiosResponse} from 'axios';
import {call, put, takeLatest} from 'redux-saga/effects';
import actions from './actions';
import apiConfigs from './apiConfigs';
import types from './constants';

export default function* saga() {
  yield takeLatest(types.GET_API_KEY, getAPIKey);
}

function* getAPIKey() {
  try {
    const response: AxiosResponse = yield call(apiConfigs.getAPIKey);
    yield put(actions.setAPIKey(response.data));
  } catch (err) {
    console.log('getAPIKey', {err});
  }
}
