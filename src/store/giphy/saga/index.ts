import { takeLatest } from 'redux-saga/effects';
import types from '../constants';
import getAPIKey from './getAPIKey';

export default function* saga() {
  yield takeLatest(
    types.GET_API_KEY, getAPIKey,
  );
}
