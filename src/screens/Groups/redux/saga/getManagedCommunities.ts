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
  payload?: {managed: boolean; preview_members: boolean};
}) {
  try {
    const {groups} = yield select();
    const {data, items, canLoadMore} = groups.managedCommunities;

    yield put(actions.setManagedCommunities({loading: data.length === 0}));

    if (!canLoadMore) return;

    // @ts-ignore
    const resp = yield call(groupsDataHelper.getJoinedCommunities, {
      managed: true,
      preview_members: true,
      limit: appConfig.recordsPerPage,
      offset: data.length,
      ...payload,
    });

    const newIds = resp?.map((item: ICommunity) => item.id);
    const newItems = mapItems(resp);

    const newData = {
      loading: false,
      data: [...data, ...newIds],
      items: {
        ...items,
        ...newItems,
      },
      canLoadMore: newIds.length === appConfig.recordsPerPage,
    };

    yield put(actions.setManagedCommunities(newData));
  } catch (err) {
    console.log('getManagedCommunities error:', err);
    yield call(showError, err);
  }
}
