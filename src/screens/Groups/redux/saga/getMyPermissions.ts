import { put, call, select } from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* getMyPermissions(): any {
  try {
    const { loading } = yield select((state) => state.groups.myPermissions);
    if (loading) return;

    yield put(actions.setMyPermissions({ loading: true }));

    const response = yield call(groupsDataHelper.getMyPermissions);

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
