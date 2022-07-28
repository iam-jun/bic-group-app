import { takeLatest } from 'redux-saga/effects';
import types from '../types';
import runSearch from './runSearch';

export default function* saga() {
  yield takeLatest(
    types.RUN_SEARCH, runSearch,
  );
}
