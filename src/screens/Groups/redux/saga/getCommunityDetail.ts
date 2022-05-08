import {put, select, call} from 'redux-saga/effects';

import actions from '~/screens/Groups/redux/actions';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {groupPrivacy} from '~/constants/privacyTypes';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {ICommunity} from '~/interfaces/ICommunity';

export default function* getCommunityDetail({
  payload,
  loadingPage,
}: {
  type: string;
  payload: number;
  loadingPage: boolean;
}) {
  try {
    if (loadingPage) yield put(actions.setLoadingPage(true));
    // @ts-ignore
    const resp = yield call(groupsDataHelper.getCommunityDetail, payload);
    yield put(actions.setCommunityDetail(resp?.data));

    const {groups} = yield select();
    const join_status = groups?.communityDetail?.join_status;
    const isMember = join_status === groupJoinStatus.member;

    const privacy = groups?.communityDetail?.privacy;
    const isPublic =
      privacy === groupPrivacy.public || privacy === groupPrivacy.open;

    if (!isMember && !isPublic) yield put(actions.setLoadingPage(false));
  } catch (err) {
    console.log('getCommunityDetail:', err);
    yield put(actions.setLoadingPage(false));
    yield put(actions.setCommunityDetail({} as ICommunity));
  }
}
