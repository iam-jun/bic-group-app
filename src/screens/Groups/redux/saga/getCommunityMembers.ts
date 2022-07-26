import { put, call, select } from 'redux-saga/effects';

import { AxiosResponse } from 'axios';
import actions from '~/screens/Groups/redux/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import { IParamGetCommunityMembers } from '~/interfaces/ICommunity';
import appConfig from '~/configs/appConfig';
import showError from '~/store/commonSaga/showError';

export default function* getCommunityMembers({
  payload,
}: {
  type: string;
  payload: {
    communityId: string;
    isRefreshing?: boolean;
    params?: IParamGetCommunityMembers;
  };
}) {
  try {
    const { groups } = yield select();
    const { communityId, isRefreshing, params } = payload;
    const { communityMembers } = groups;
    const { canLoadMore, offset } = communityMembers;

    yield put(
      actions.setCommunityMembers({
        loading: isRefreshing ? true : offset === 0,
      }),
    );

    if (!isRefreshing && !canLoadMore) return;

    const resp:AxiosResponse = yield call(groupsDataHelper.getCommunityMembers, communityId, {
      limit: appConfig.recordsPerPage,
      offset: isRefreshing ? 0 : offset,
      ...params,
    });

    let newDataCount = 0;
    let newDataObj = {};

    Object.keys(resp)?.forEach?.((role: string) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const roles = resp[role] || {};
      newDataCount += roles.data?.length || 0;
      newDataObj = {
        ...newDataObj,
        [role]: {
          name: resp[role]?.name,
          userCount: resp[role]?.userCount,
          data:
            isRefreshing || !communityMembers?.[role]?.data
              ? [...roles.data]
              : [...communityMembers?.[role]?.data || [], ...roles.data],
        },
      };
    });

    const newData = {
      loading: false,
      canLoadMore: newDataCount === appConfig.recordsPerPage,
      offset: isRefreshing ? newDataCount : offset + newDataCount,
      ...newDataObj,
    };

    yield put(actions.setCommunityMembers(newData));
  } catch (err: any) {
    console.error('getCommunityMembers error:', err);
    yield call(showError, err);
  }
}
