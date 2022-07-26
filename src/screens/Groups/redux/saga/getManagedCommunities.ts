import { put, call, select } from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';

import actions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import { mapItems } from '../../helper/mapper';
import { ICommunity } from '~/interfaces/ICommunity';

export default function* getManagedCommunities({
  payload,
}: {
  type: string;
  payload: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
    params?: {managed: boolean; preview_members: boolean};
  };
}) {
  try {
    const { isRefreshing, refreshNoLoading, params } = payload;
    const { groups } = yield select();
    const { ids, items, canLoadMore } = groups.managedCommunities;

    yield put(
      actions.setManagedCommunities({
        loading: isRefreshing ? true : ids.length === 0,
      }),
    );

    if (!isRefreshing && !refreshNoLoading && !canLoadMore) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const resp = yield call(groupsDataHelper.getJoinedCommunities, {
      managed: true,
      preview_members: true,
      limit: appConfig.recordsPerPage,
      offset: isRefreshing || refreshNoLoading ? 0 : ids.length,
      ...params,
    });

    const communities = resp.data
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
