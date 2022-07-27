/* eslint-disable @typescript-eslint/ban-ts-comment */
import { put, call, select } from 'redux-saga/effects';

import { AxiosResponse } from 'axios';
import actions from '~/screens/Groups/redux/actions';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import { IParamGetCommunityMembers } from '~/interfaces/ICommunity';
import appConfig from '~/configs/appConfig';
import showError from '~/store/commonSaga/showError';

export default function* getCommunitySearchMembers({
  payload,
}: {
  type: string;
  payload: {communityId: string; params: IParamGetCommunityMembers};
}) {
  try {
    const { groups } = yield select();
    const { canLoadMore, data } = groups.communitySearchMembers;
    yield put(actions.setCommunitySearchMembers({ loading: data.length === 0 }));

    const { communityId, params } = payload;

    if (!canLoadMore) return;

    const resp: AxiosResponse = yield call(groupsDataHelper.getCommunityMembers, communityId, {
      limit: appConfig.recordsPerPage,
      offset: data.length,
      ...params,
    });

    let newDataCount = 0;
    let newDataArr: any = [];
    const members = resp.data;
    Object.keys(members)?.forEach?.((role: string) => {
      // @ts-ignore
      newDataCount += members[role]?.data?.length || 0;
      // @ts-ignore
      newDataArr = [...newDataArr, ...members[role]?.data || []];
    });

    // update search results data
    const newData = {
      loading: false,
      canLoadMore: newDataCount === appConfig.recordsPerPage,
      data: [...data, ...newDataArr],
    };

    yield put(actions.setCommunitySearchMembers(newData));
  } catch (err: any) {
    console.error('getCommunitySearchMembers error:', err);
    yield call(showError, err);
  }
}
