import { put, call, select } from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';

import actions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '~/storeRedux/commonSaga/showError';
import { mapItems } from '../../../screens/groups/helper/mapper';
import { ICommunity } from '~/interfaces/ICommunity';

export default function* getManagedCommunities({
  payload,
}: {
  type: string;
  payload: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
    params?: {managed: boolean; previewMembers: boolean};
  };
}) {
  try {
    const { isRefreshing, refreshNoLoading, params } = payload;
    const { groups } = yield select();
    const { ids, items, canLoadMore } = groups.managedCommunities;

    yield put(actions.setManagedCommunities({
      loading: isRefreshing ? true : ids.length === 0,
    }));

    if (!isRefreshing && !refreshNoLoading && !canLoadMore) return;

    const resp = yield call(groupApi.getJoinedCommunities, {
      managed: true,
      previewMembers: true,
      limit: appConfig.recordsPerPage,
      offset: isRefreshing || refreshNoLoading ? 0 : ids.length,
      ...params,
    });

    const communities = resp.data;
    const newIds = communities?.map((item: ICommunity) => item.id);
    const newItems = mapItems(communities);

    const newData = {
      loading: false,
      ids: isRefreshing || refreshNoLoading ? [...newIds] : [...ids, ...newIds],
      items:
        isRefreshing || refreshNoLoading
          ? { ...newItems }
          : { ...items, ...newItems },
      canLoadMore: newIds.length === appConfig.recordsPerPage,
    };

    yield put(actions.setManagedCommunities(newData));
  } catch (err) {
    console.error('getManagedCommunities error:', err);
    yield put(actions.setManagedCommunities({ loading: false }));
    yield call(showError, err);
  }
}
