import { put, call, select } from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '~/api/GroupApi';

export default function* getMyPermissions(): any {
  try {
    const { loading } = yield select((state) => state.groups.myPermissions);
    if (loading) return;

    yield put(actions.setMyPermissions({ loading: true }));

    const response = yield call(groupApi.getMyPermissions);

    yield put(actions.setMyPermissions({
      loading: false,
      data: response.data,
      timeGetMyPermissions: Date.now(),
    }));
  } catch (err) {
    console.error(
      'getMyPermissions error:', err,
    );
    yield call(
      showError, err,
    );
  }
}
