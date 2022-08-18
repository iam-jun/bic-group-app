import { AxiosResponse } from 'axios';
import { call, put } from 'redux-saga/effects';
import actions from '../actions';
import streamApi from '~/api/StreamApi';

export default function* getAPIKey() {
  try {
    const response: AxiosResponse = yield call(streamApi.getGiphyAPIKey);
    yield put(actions.setAPIKey(response.data));
  } catch (err) {
    console.error(
      'getAPIKey', { err },
    );
  }
}
