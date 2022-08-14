import { put, select, call } from 'redux-saga/effects';

import groupsActions from '~/storeRedux/groups/actions';
import groupJoinStatus from '~/constants/groupJoinStatus';
import { groupPrivacy } from '~/constants/privacyTypes';
import groupApi from '~/api/GroupApi';

export default function* getGroupDetail({
  payload,
}: {
  type: string;
  payload: {groupId: string; loadingPage?: boolean;}
}) {
  try {
    const { groupId, loadingPage } = payload;

    if (loadingPage) yield put(groupsActions.setLoadingPage(true));

    const resp = yield call(groupApi.getGroupDetail, groupId);
    yield put(groupsActions.setGroupDetail(resp?.data));

    const { groups } = yield select();
    const joinStatus = groups?.groupDetail?.joinStatus;
    const isMember = joinStatus === groupJoinStatus.member;

    const privacy = groups?.groupDetail?.group?.privacy;
    const isPublic = privacy === groupPrivacy.public;

    if (!isMember && !isPublic) yield put(groupsActions.setLoadingPage(false));
  } catch (e) {
    console.error('[getGroupDetail]', e);
    yield put(groupsActions.setLoadingPage(false));
    yield put(groupsActions.setGroupDetail(null));
  }
}
