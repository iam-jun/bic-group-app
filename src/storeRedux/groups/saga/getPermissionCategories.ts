import { put, call } from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* getPermissionCategories({
  payload,
}: {
  type: string;
  payload?: 'SYSTEM' | 'COMMUNITY' | 'GROUP';
}): any {
  try {
    yield put(actions.setPermissionCategories({ loading: true, data: undefined }));
    const response = yield call(
      groupsDataHelper.getPermissionCategories,
      payload,
    );
    if (response?.data) {
      yield put(actions.setPermissionCategories({ loading: false, data: response?.data }));
    } else {
      yield put(actions.setPermissionCategories({ loading: false }));
    }
  } catch (err) {
    yield put(actions.setPermissionCategories({ loading: false }));
    console.error(
      'getPermissionCategories error:', err,
    );
    yield call(
      showError, err,
    );
  }
}
