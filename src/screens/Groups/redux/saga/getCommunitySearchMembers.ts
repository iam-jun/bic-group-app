import {put, call, select} from 'redux-saga/effects';

import actions from '~/screens/Groups/redux/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {IParamGetCommunityMembers} from '~/interfaces/ICommunity';
import appConfig from '~/configs/appConfig';
import showError from '~/store/commonSaga/showError';

export default function* getCommunitySearchMembers({
  payload,
}: {
  type: string;
  payload: {communityId: string; params: IParamGetCommunityMembers};
}) {
  try {
    const {groups} = yield select();
    const {canLoadMore, data} = groups.communitySearchMembers;
    yield put(actions.setCommunitySearchMembers({loading: data.length === 0}));

    const {communityId, params} = payload;

    if (!canLoadMore) return;

    // @ts-ignore
    const resp = yield call(groupsDataHelper.getCommunityMembers, communityId, {
      limit: appConfig.recordsPerPage,
      offset: data.length,
      ...params,
    });

    let newDataCount = 0;
    let newDataArr: any = [];
    Object.keys(resp)?.map?.((role: string) => {
      newDataCount += resp[role]?.data?.length;
      newDataArr = [...newDataArr, ...resp[role]?.data];
    });

    // update search results data
    const newData = {
      loading: false,
      canLoadMore: newDataCount === appConfig.recordsPerPage,
      data: [...data, ...newDataArr],
    };

    yield put(actions.setCommunitySearchMembers(newData));
  } catch (err: any) {
    console.log('getCommunitySearchMembers error:', err);
    yield call(showError, err);
  }
}
