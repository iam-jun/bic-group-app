/* eslint-disable @typescript-eslint/ban-ts-comment */
import { put, call, select } from 'redux-saga/effects';

import { AxiosResponse } from 'axios';
import actions from '~/storeRedux/groups/actions';
import groupApi from '~/api/GroupApi';
import { IParamGetCommunityMembers } from '~/interfaces/ICommunity';
import appConfig from '~/configs/appConfig';
import showError from '~/storeRedux/commonSaga/showError';

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

    const resp: AxiosResponse = yield call(
      groupApi.getCommunityMembers, communityId, {
        limit: appConfig.recordsPerPage,
        offset: data.length,
        ...params,
      },
    );

    let newDataCount = 0;
    let newDataArr: any = [];
    const members = resp.data;
    Object.keys(members)?.forEach?.((role: string) => {
      newDataCount += members[role]?.data?.length || 0;
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
    console.error(
      'getCommunitySearchMembers error:', err,
    );
    yield call(
      showError, err,
    );
  }
}
