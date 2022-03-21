import {put, select, call} from 'redux-saga/effects';

import groupsActions from '~/screens/Groups/redux/actions';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {groupPrivacy} from '~/constants/privacyTypes';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* getGroupDetail({
  payload,
  loadingPage,
}: {
  type: string;
  payload: number;
  loadingPage: boolean;
}) {
  try {
    if (loadingPage) yield put(groupsActions.setLoadingPage(true));
    // @ts-ignore
    const resp = yield call(groupsDataHelper.getGroupDetail, payload);
    yield put(groupsActions.setGroupDetail(resp?.data));

    const {groups} = yield select();
    const join_status = groups?.groupDetail?.join_status;
    const isMember = join_status === groupJoinStatus.member;

    const privacy = groups?.groupDetail?.group?.privacy;
    const isPublic = privacy === groupPrivacy.public;

    if (!isMember && !isPublic) yield put(groupsActions.setLoadingPage(false));
  } catch (e) {
    console.log('[getGroupDetail]', e);
    yield put(groupsActions.setLoadingPage(false));
    yield put(groupsActions.setGroupDetail(null));
  }
}
