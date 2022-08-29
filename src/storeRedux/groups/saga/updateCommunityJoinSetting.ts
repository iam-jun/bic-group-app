import { call, put } from 'redux-saga/effects';

import groupApi from '~/api/GroupApi';
import showError from '~/storeRedux/commonSaga/showError';
import groupsActions from '../actions';

export default function* updateCommunityJoinSetting({
  payload,
}: {
  type: string;
  payload: {communityId: string; isJoinApproval: boolean};
}) {
  try {
    const { communityId, isJoinApproval } = payload || {};

    yield call(groupApi.updateCommunityJoinSetting, communityId, isJoinApproval);

    // to update isJoinApproval status
    yield put(groupsActions.getCommunityDetail({ communityId }));
  } catch (err) {
    console.error('updateCommunityJoinSetting error:', err);
    yield call(showError, err);
  }
}
