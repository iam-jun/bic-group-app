import { call, put, select } from 'redux-saga/effects';

import groupsActions from '../actions';
import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '~/api/GroupApi';
import appConfig from '~/configs/appConfig';
import { ICommunity } from '~/interfaces/ICommunity';
import { mapItems } from '~/screens/groups/helper/mapper';

export default function* getJoinedCommunities({
  payload,
}: {
  type: string;
  payload?: {
    isRefreshing?: boolean;
    refreshNoLoading?: boolean;
    params?: {managed: boolean; previewMembers: boolean};
    callback?: () => void;
  }
}) {
  try {
    const {
      isRefreshing, refreshNoLoading, params, callback,
    } = payload;
    const { groups } = yield select();
    const { ids, items, canLoadMore } = groups.joinedCommunities;

    yield put(groupsActions.setMyCommunities({
      loading: isRefreshing ? true : ids.length === 0,
    }));

    if (!isRefreshing && !refreshNoLoading && !canLoadMore) return;

    const resp = yield call(groupApi.getJoinedCommunities, {
      managed: false,
      previewMembers: true,
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

    yield put(groupsActions.setMyCommunities(newData));

    if (callback) callback();
  } catch (err) {
    console.error('\x1b[33m', 'getJoinedCommunities : error', err, '\x1b[0m');
    yield put(groupsActions.setMyCommunities({ loading: false }));
    yield call(showError, err);
  }
}
