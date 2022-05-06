import {put, select, call} from 'redux-saga/effects';

import actions from '~/screens/Groups/redux/actions';
import groupJoinStatus from '~/constants/groupJoinStatus';
import {groupPrivacy} from '~/constants/privacyTypes';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* getCommunityDetail({
  payload,
  loadingPage,
}: {
  type: string;
  payload: number;
  loadingPage: boolean;
}) {
  try {
    // @ts-ignore
    const resp = yield call(groupsDataHelper.getCommunityDetail, payload);
    yield put(actions.setCommunityDetail(resp?.data));
  } catch (err) {
    console.log('getCommunityDetail:', err);
    yield put(actions.setCommunityDetail(null));
  }
}
