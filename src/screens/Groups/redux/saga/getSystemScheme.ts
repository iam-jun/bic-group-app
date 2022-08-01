import { put, call } from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import { sortFixedRoles } from '../../helper';

export default function* getSystemScheme(): any {
  try {
    yield put(actions.setSystemScheme({ loading: true, data: undefined }));
    const response = yield call(groupsDataHelper.getSystemScheme);
    if (response?.data) {
      const dataWithOrderedFixRole = sortFixedRoles(response?.data);
      yield put(actions.setSystemScheme({ loading: false, data: dataWithOrderedFixRole }));
    } else {
      yield put(actions.setSystemScheme({ loading: false }));
    }
  } catch (err) {
    yield put(actions.setSystemScheme({ loading: false }));
    console.error(
      'getSystemScheme error:', err,
    );
    yield call(
      showError, err,
    );
  }
}
