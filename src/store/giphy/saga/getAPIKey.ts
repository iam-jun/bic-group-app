import {AxiosResponse} from 'axios';
import {call, put} from 'redux-saga/effects';
import actions from '../actions';
import apiConfigs from '../apiConfigs';

export default function* getAPIKey() {
  try {
    const response: AxiosResponse = yield call(apiConfigs.getAPIKey);
    yield put(actions.setAPIKey(response.data));
  } catch (err) {
    console.log('getAPIKey', {err});
  }
}
