import { put, call } from 'redux-saga/effects';

import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '~/storeRedux/commonSaga/showError';

export default function* getGroupStructureCommunityTree({
  payload,
}: {
  type: string;
  payload: {communityId: string; showLoading?: boolean};
}): any {
  const { communityId, showLoading = true } = payload || {};
  try {
    if (showLoading) {
      yield put(groupsActions.setGroupStructureCommunityTree({ loading: true }));
    }
    const response = (yield call(
      groupApi.getCommunityGroupTree, communityId,
    )) || [];

    if (response?.data) {
      yield put(groupsActions.setGroupStructureCommunityTree({
        loading: false,
        data: response.data,
      }));
    } else {
      yield put(groupsActions.setGroupStructureCommunityTree({ loading: false }));
    }
  } catch (err) {
    yield put(groupsActions.setGroupStructureCommunityTree({ loading: false }));
    yield showError(err);
  }
}
