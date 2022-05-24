import appConfig from '~/configs/appConfig';
import {put, call, select} from 'redux-saga/effects';

import {IParamGetDiscoverGroups} from '~/interfaces/ICommunity';
import actions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import {mapItems} from '../../helper/mapper';

export default function* getDiscoverGroups({
  payload,
}: {
  type: string;
  payload: {communityId: number; params?: IParamGetDiscoverGroups};
}) {
  try {
    const {groups} = yield select();
    const {communityId, params} = payload;
    const {data, canLoadMore} = groups.discoverGroups;

    if (!canLoadMore) return;

    // @ts-ignore
    const resp = yield call(groupsDataHelper.getDiscoverGroups, communityId, {
      limit: appConfig.recordsPerPage,
      offset: data.length,
      ...params,
    });

    const ids = resp?.data.map((item: any) => item.id);
    const items = mapItems(resp?.data);

    yield put(actions.setDiscoverGroups({ids, items}));
  } catch (err) {
    console.log('getDiscoverGroups error:', err);
    yield call(showError, err);
  }
}
