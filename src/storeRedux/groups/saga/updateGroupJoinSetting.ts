import { call, put } from 'redux-saga/effects';

import groupApi from '~/api/GroupApi';
import showError from '~/storeRedux/commonSaga/showError';
import groupsActions from '../actions';

export default function* updateGroupJoinSetting({
  payload,
}: {
  type: string;
  payload: {groupId: string; isJoinApproval: boolean};
}) {
  try {
    const { groupId, isJoinApproval } = payload || {};

    yield call(groupApi.updateGroupJoinSetting, groupId, isJoinApproval);

    // to update isJoinApproval status
    yield put(groupsActions.getGroupDetail({ groupId }));
  } catch (err) {
    console.error('updateGroupJoinSetting error:', err);
    yield call(showError, err);
  }
}
