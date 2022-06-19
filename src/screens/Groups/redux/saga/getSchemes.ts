import {put, call} from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* getSchemes({
  payload,
}: {
  type: string;
  payload: {communityId: number | string};
}): any {
  try {
    const {communityId} = payload || {};
    yield put(actions.setSchemes({loading: true, data: undefined}));
    const response = yield call(groupsDataHelper.getSchemes, communityId);
    if (response?.data) {
      yield put(actions.setSchemes({loading: false, data: response?.data}));
    } else {
      yield put(actions.setSchemes({loading: false}));
    }
  } catch (err) {
    yield put(actions.setSchemes({loading: false}));
    console.log('getSchemes error:', err);
    yield call(showError, err);
  }
}
