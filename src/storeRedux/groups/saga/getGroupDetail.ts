import { put, select, call } from 'redux-saga/effects';

import groupsActions from '~/storeRedux/groups/actions';
import GroupJoinStatus from '~/constants/GroupJoinStatus';
import groupApi from '~/api/GroupApi';
import { GroupPrivacyType } from '~/constants/privacyTypes';

export default function* getGroupDetail({
  payload,
}: {
  type: string;
  payload: {groupId: string; loadingPage?: boolean;}
}) {
  try {
    const { groupId, loadingPage } = payload;

    yield put(groupsActions.setGroupDetailError(false));
    if (loadingPage) yield put(groupsActions.setLoadingPage(true));

    const resp = yield call(groupApi.getGroupDetail, groupId);
    yield put(groupsActions.setGroupDetail(resp?.data));

    const { groups } = yield select();
    const joinStatus = groups?.groupDetail?.joinStatus;
    const isMember = joinStatus === GroupJoinStatus.MEMBER;

    const privacy = groups?.groupDetail?.group?.privacy;
    const isPublic = privacy === GroupPrivacyType.PUBLIC;

    if (!isMember && !isPublic) yield put(groupsActions.setLoadingPage(false));
  } catch (e) {
    console.error('[getGroupDetail]', e);
    yield put(groupsActions.setGroupDetailError(true));
    yield put(groupsActions.setLoadingPage(false));
  }
}
