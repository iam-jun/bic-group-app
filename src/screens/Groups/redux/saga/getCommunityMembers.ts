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
  payload: {
    communityId: number;
    isRefreshing?: boolean;
    params?: IParamGetCommunityMembers;
  };
}) {
  try {
    const {groups} = yield select();
    const {communityId, isRefreshing, params} = payload;
    const {canLoadMore, community_admin, community_member, offset} =
      groups.communityMembers;

    yield put(
      actions.setCommunityMembers({
        loading: isRefreshing ? true : offset === 0,
      }),
    );

    if (!isRefreshing && !canLoadMore) return;

    // @ts-ignore
    const resp = yield call(groupsDataHelper.getCommunityMembers, communityId, {
      limit: appConfig.recordsPerPage,
      offset: isRefreshing ? 0 : offset,
      ...params,
    });

    const respData = resp?.data;
    if (respData) {
      const newDataCount =
        respData.community_admin.data.length +
        respData.community_member.data.length;
      const newData = {
        loading: false,
        canLoadMore: newDataCount === appConfig.recordsPerPage,
        offset: isRefreshing ? newDataCount : offset + newDataCount,
        community_admin: {
          data: isRefreshing
            ? [...respData.community_admin.data]
            : [...community_admin.data, ...respData.community_admin.data],
          user_count: respData.community_admin.user_count,
        },
        community_member: {
          data: isRefreshing
            ? [...respData.community_member.data]
            : [...community_member.data, ...respData.community_member.data],
          user_count: respData.community_member.user_count,
        },
      };

      yield put(actions.setCommunityMembers(newData));
    }
  } catch (err: any) {
    console.log('getCommunityMembers error:', err);
    yield call(showError, err);
  }
}
