import { put, call, select } from 'redux-saga/effects';

import actions from '~/storeRedux/groups/actions';
import groupApi from '~/api/GroupApi';
import { IParamGetCommunityMembers } from '~/interfaces/ICommunity';
import appConfig from '~/configs/appConfig';
import showError from '~/storeRedux/commonSaga/showError';

export default function* getCommunityMembers({
  payload,
}: {
  type: string;
  payload: {
    groupId: string;
    isRefreshing?: boolean;
    params?: IParamGetCommunityMembers;
  };
}) {
  try {
    const { groups } = yield select();
    const { groupId, isRefreshing, params } = payload;
    const { communityMembers } = groups;
    const { canLoadMore, offset } = communityMembers;

    yield put(actions.setCommunityMembers({
      loading: isRefreshing ? true : offset === 0,
    }));

    if (!isRefreshing && !canLoadMore) return;

    const response = yield call(
      groupApi.getGroupMembers, groupId, {
        limit: appConfig.recordsPerPage,
        offset: isRefreshing ? 0 : offset,
        ...params,
      },
    );

    let newDataCount = 0;
    let newDataObj = {};

    const members = response.data;
    Object.keys(members)?.forEach?.((role: string) => {
      const roles = members[role] || {};
      newDataCount += roles.data?.length || 0;
      newDataObj = {
        ...newDataObj,
        [role]: {
          name: members[role]?.name,
          userCount: members[role]?.userCount,
          data:
            isRefreshing || !communityMembers?.[role]?.data
              ? [...roles.data || []]
              : [...communityMembers?.[role]?.data || [], ...roles.data || []],
        },
      };
    });

    const newData = {
      loading: false,
      canLoadMore: !!response?.meta?.hasNextPage,
      offset: isRefreshing ? newDataCount : offset + newDataCount,
      ...newDataObj,
    };

    yield put(actions.setCommunityMembers(newData));
  } catch (err: any) {
    console.error(
      'getCommunityMembers error:', err,
    );
    yield call(
      showError, err,
    );
  }
}
