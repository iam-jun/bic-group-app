import appConfig from '~/configs/appConfig';
import {put, call, select} from 'redux-saga/effects';

import actions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import {mapItems} from '../../helper/mapper';
import {ICommunity} from '~/interfaces/ICommunity';

export default function* getManagedCommunities({
  payload,
}: {
  type: string;
  payload: {
    isRefreshing?: boolean;
    params?: {managed: boolean; preview_members: boolean};
  };
}) {
  try {
    const {isRefreshing, params} = payload;
    const {groups} = yield select();
    const {ids, items, canLoadMore} = groups.managedCommunities;

    yield put(
      actions.setManagedCommunities({
        loading: isRefreshing ? true : ids.length === 0,
      }),
    );

    if (!isRefreshing && !canLoadMore) return;

    // @ts-ignore
    const resp = yield call(groupsDataHelper.getJoinedCommunities, {
      managed: true,
      preview_members: true,
      limit: appConfig.recordsPerPage,
      offset: isRefreshing ? 0 : ids.length,
      ...params,
    });

    const newIds = resp?.map((item: ICommunity) => item.id);
    const newItems = mapItems(resp);

    const newData = {
      loading: false,
      ids: isRefreshing ? [...newIds] : [...ids, ...newIds],
      items: isRefreshing ? {...newItems} : {...items, ...newItems},
      canLoadMore: newIds.length === appConfig.recordsPerPage,
    };

    yield put(actions.setManagedCommunities(newData));
  } catch (err) {
    console.log('getManagedCommunities error:', err);
    yield put(actions.setManagedCommunities({loading: false}));
    yield call(showError, err);
  }
}
