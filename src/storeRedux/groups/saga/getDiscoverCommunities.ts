import { put, call, select } from 'redux-saga/effects';

import groupsActions from '../actions';
import groupApi from '../../../api/GroupApi';
import showError from '~/storeRedux/commonSaga/showError';
import { IParamGetCommunities } from '~/interfaces/ICommunity';
import appConfig from '~/configs/appConfig';
import { mapItems } from '../../../screens/Groups/helper/mapper';

export default function* getDiscoverCommunities({
  payload,
}: {
  type: string;
  payload: {isRefreshing?: boolean; refreshNoLoading?: boolean};
}): any {
  try {
    const { groups } = yield select();

    const { isRefreshing, refreshNoLoading } = payload;
    const { ids, items, canLoadMore } = groups.discoverCommunities;

    yield put(groupsActions.setDiscoverCommunities({
      loading: isRefreshing ? true : ids.length === 0,
    }));

    if (!isRefreshing && !refreshNoLoading && !canLoadMore) return;

    const params: IParamGetCommunities = {
      limit: appConfig.recordsPerPage,
      offset: isRefreshing || refreshNoLoading ? 0 : ids.length,
    };

    const response = yield call(
      groupApi.getDiscoverCommunities,
      params,
    );

    const respData = response.data;
    const newIds = respData.map((item: any) => item.id);
    const newItems = mapItems(respData);

    const newData = {
      loading: false,
      canLoadMore: newIds.length === appConfig.recordsPerPage,
      ids: isRefreshing || refreshNoLoading ? [...newIds] : [...ids, ...newIds],
      items:
        isRefreshing || refreshNoLoading
          ? { ...newItems }
          : { ...items, ...newItems },
    };

    yield put(groupsActions.setDiscoverCommunities(newData));
  } catch (err) {
    console.error(
      '\x1b[33m', 'getDiscoverCommunities : error', err, '\x1b[0m',
    );
    yield put(groupsActions.setDiscoverCommunities({ loading: false }));
    yield call(
      showError, err,
    );
  }
}
