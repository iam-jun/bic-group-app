import { put, call, select } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import appConfig from '~/configs/appConfig';

import { IParamGetDiscoverGroups } from '~/interfaces/ICommunity';
import actions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '~/storeRedux/commonSaga/showError';
import { mapItems } from '../../../screens/groups/helper/mapper';

export default function* getDiscoverGroups({
  payload,
}: {
  type: string;
  payload: {
    communityId: string;
    isRefreshing?: boolean;
    params?: IParamGetDiscoverGroups;
  };
}) {
  try {
    const { groups } = yield select();
    const { communityId, params, isRefreshing } = payload;
    const { ids, items, canLoadMore } = groups.discoverGroups;

    yield put(actions.setDiscoverGroups({
      loading: isRefreshing ? true : ids.length === 0,
    }));

    if (!isRefreshing && !canLoadMore) return;

    const resp: AxiosResponse = yield call(
      groupApi.getDiscoverGroups, communityId, {
        limit: appConfig.recordsPerPage,
        offset: isRefreshing ? 0 : ids.length,
        ...params,
      },
    );

    const respData = resp.data;
    const newIds = respData.map((item: any) => item.id);
    const newItems = mapItems(respData);

    const newData = {
      loading: false,
      canLoadMore: newIds.length === appConfig.recordsPerPage,
      ids: isRefreshing ? [...newIds] : [...ids, ...newIds],
      items: isRefreshing ? { ...newItems } : { ...items, ...newItems },
    };

    yield put(actions.setDiscoverGroups(newData));
  } catch (err) {
    console.error(
      'getDiscoverGroups error:', err,
    );
    yield put(actions.setDiscoverGroups({ loading: false }));
    yield call(
      showError, err,
    );
  }
}
