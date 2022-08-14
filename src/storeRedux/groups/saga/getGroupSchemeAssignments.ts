import { put, call } from 'redux-saga/effects';

import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '~/storeRedux/commonSaga/showError';

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
      groupApi.getGroupSchemeAssignments,
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
