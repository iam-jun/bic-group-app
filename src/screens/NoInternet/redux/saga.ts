import {
  put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

import actions from './actions';
import authActions from '~/screens/Auth/redux/actions';
import types from './types';
import { timeOut } from '~/utils/common';

export default function* noInternetSaga() {
  yield takeLatest(types.CHECK_IS_INTERNET_REACHABLE, checkIsInternetReachable);

  /**
   * Need to check every showSystemIssue instead of take latest to handle
   * the issue immediately. But we'll check whether to continue executing
   * logging user out to avoid kicking them out multiple times in a short period
   */
  yield takeEvery(
    types.SHOW_SYSTEM_ISSUE_THEN_LOGOUT,
    showSystemIssueThenLogout,
  );
  yield takeEvery(types.HIDE_SYSTEM_ISSUE_AND_LOGOUT, hideSystemIssueAndLogout);
}

function* setIsInternetReachable(state: NetInfoState) {
  const { noInternet } = yield select();
  const { isInternetReachable } = noInternet;

  const result = state.isInternetReachable ? state.isConnected : false;

  if (isInternetReachable !== result) yield put(actions.setIsInternetReachable(result));
}

function* checkIsInternetReachable() {
  try {
    let netInfoState = {} as NetInfoState;

    // eslint-disable-next-line no-return-assign
    yield NetInfo.fetch().then((state) => (netInfoState = state));

    if (netInfoState.isInternetReachable === null) {
      const threshold = 5000; // 5000 is for slow 3G, the faster network, the smaller threshold is
      yield timeOut(threshold);
      // eslint-disable-next-line no-return-assign
      yield NetInfo.fetch().then((state) => (netInfoState = state));
    }

    yield setIsInternetReachable(netInfoState);
  } catch (error) {
    console.error('Error when checking internet connection', error);
  }
}

function* showSystemIssueThenLogout() {
  try {
    const { noInternet } = yield select();
    const isShownAlready = noInternet.systemIssue;

    /**
     * Return if the system issue modal is already shown
     * to avoid putting another logging out in 2 seconds
     */
    if (isShownAlready) return;

    yield put(actions.setSystemIssue(true));

    const MODAL_VISIBLE_DURATION = 2000;
    yield timeOut(MODAL_VISIBLE_DURATION);
    yield hideSystemIssueAndLogout();
  } catch (error) {
    console.error('error', error);
  }
}

function* hideSystemIssueAndLogout() {
  const { noInternet } = yield select();
  const isShownAlready = noInternet.systemIssue;
  if (!isShownAlready) return;

  yield put(actions.setSystemIssue(false));
  yield put(authActions.signOut());
}
