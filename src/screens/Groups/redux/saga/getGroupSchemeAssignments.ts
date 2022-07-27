import { put, call } from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

export default function* getGroupSchemeAssignments({
  payload,
}: {
  type: string;
  payload: {
    communityId: string;
    showLoading?: boolean;
  };
}): any {
  const { communityId, showLoading = true } = payload || {};
  try {
    if (showLoading) {
      yield put(groupsActions.setGroupSchemeAssignments({ loading: true }));
    }

    const response = yield call(
      groupsDataHelper.getGroupSchemeAssignments,
      communityId,
    );

    if (response?.data) {
      yield put(groupsActions.setGroupSchemeAssignments({
        loading: false,
        data: response.data,
      }));
    } else {
      yield put(groupsActions.setGroupSchemeAssignments({ loading: false }));
    }
  } catch (err) {
    yield put(groupsActions.setGroupSchemeAssignments({ loading: false }));
    yield showError(err);
  }
}
