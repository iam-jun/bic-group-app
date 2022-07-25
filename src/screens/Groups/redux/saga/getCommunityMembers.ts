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
    communityId: string;
    isRefreshing?: boolean;
    params?: IParamGetCommunityMembers;
  };
}) {
  try {
    const {groups} = yield select();
    const {communityId, isRefreshing, params} = payload;
    const communityMembers = groups.communityMembers;
    const {canLoadMore, offset} = communityMembers;

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

    let newDataCount = 0;
    let newDataObj = {};
    Object.keys(resp)?.map?.((role: string) => {
      newDataCount += resp[role]?.data?.length;
      newDataObj = {
        ...newDataObj,
        [role]: {
          name: resp[role]?.name,
          user_count: resp[role]?.user_count,
          data:
            isRefreshing || !communityMembers?.[role]?.data
              ? [...resp[role]?.data]
              : [...communityMembers?.[role]?.data, ...resp[role]?.data],
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
    console.log('getCommunityMembers error:', err);
    yield call(showError, err);
  }
}
