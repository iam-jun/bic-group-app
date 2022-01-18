import {put, select, takeLatest} from 'redux-saga/effects';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

import actions from './actions';
import authActions from '~/screens/Auth/redux/actions';
import types from './types';

export default function* noInternetSaga() {
  yield takeLatest(types.CHECK_IS_INTERNET_REACHABLE, checkIsInternetReachable);
  yield takeLatest(types.SHOW_SYSTEM_ISSUE, showSystemIssue);
  yield takeLatest(types.HIDE_SYSTEM_ISSUE, hideSystemIssue);
}

function timeOut(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function* setIsInternetReachable(state: NetInfoState) {
  const {noInternet} = yield select();
  const {isInternetReachable} = noInternet;

  const result = state.isInternetReachable ? state.isConnected : false;

  if (isInternetReachable !== result)
    yield put(actions.setIsInternetReachable(result));
}

function* checkIsInternetReachable() {
  try {
    let netInfoState = {} as NetInfoState;

    yield NetInfo.fetch().then(state => (netInfoState = state));

    if (netInfoState.isInternetReachable === null) {
      const threshold = 5000; // 5000 is for slow 3G, the faster network, the smaller threshold is
      yield timeOut(threshold);
      yield NetInfo.fetch().then(state => (netInfoState = state));
    }

    yield setIsInternetReachable(netInfoState);
  } catch (error) {
    console.error('Error when checking internet connection', error);
  }
}

function* showSystemIssue() {
  try {
    const {noInternet} = yield select();
    const isShownAlready = noInternet.systemIssue;
    if (isShownAlready) return;

    yield put(actions.setSystemIssue(true));

    // Must run hideSystemIssue after 2 seconds
    const MODAL_VISIBLE_DURATION = 2000;
    yield timeOut(MODAL_VISIBLE_DURATION);
    yield hideSystemIssue();
  } catch (error) {
    console.log(`error`, error);
  }
}

function* hideSystemIssue() {
  const {noInternet} = yield select();
  const isShownAlready = noInternet.systemIssue;
  if (!isShownAlready) return;

  yield put(actions.setSystemIssue(false));
  yield put(authActions.signOut());
}
