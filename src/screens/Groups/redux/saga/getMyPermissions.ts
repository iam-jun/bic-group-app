import {put, call} from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* getMyPermissions(): any {
  try {
    yield put(actions.setMyPermissions({loading: true}));

    const response = yield call(groupsDataHelper.getMyPermissions);

    yield put(actions.setMyPermissions({loading: false, data: response.data}));
  } catch (err) {
    console.log('getMyPermissions error:', err);
    yield call(showError, err);
  }
}
