import {put, call, select} from 'redux-saga/effects';

import actions from '~/screens/Groups/redux/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {IParamGetCommunityMembers} from '~/interfaces/ICommunity';
import appConfig from '~/configs/appConfig';
import showError from '~/store/commonSaga/showError';

export default function* getCommunityMembers({
  payload,
}: {
  type: string;
  payload: {communityId: number; params?: IParamGetCommunityMembers};
}) {
  try {
    const {groups} = yield select();
    const {communityId, params} = payload;
    const {canLoadMore, community_admin, member} = groups.communityMembers;

    if (!canLoadMore) return;

    // @ts-ignore
    const resp = yield call(groupsDataHelper.getCommunityMembers, communityId, {
      limit: appConfig.recordsPerPage,
      offset: community_admin.data.length + member.data.length,
      ...params,
    });

    yield put(actions.setCommunityMembers(resp?.data));
  } catch (err: any) {
    console.log('getCommunityMembers error:', err);
    yield call(showError, err);
  }
}

export function* getSearchMembers({
  payload,
}: {
  type: string;
  payload: {communityId: number; params: IParamGetCommunityMembers};
}) {
  try {
    const {groups} = yield select();
    const {communityId, params} = payload;
    const {canLoadMore, community_admin, member} = groups.searchMembers;

    if (!canLoadMore) return;

    // @ts-ignore
    const resp = yield call(groupsDataHelper.getCommunityMembers, communityId, {
      limit: appConfig.recordsPerPage,
      offset: community_admin.data.length + member.data.length,
      ...params,
    });

    yield put(actions.setSearchMembers(resp?.data));
  } catch (err: any) {
    console.log('getSearchMembers error:', err);
    yield call(showError, err);
  }
}
