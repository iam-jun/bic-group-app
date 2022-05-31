import {put, call, select} from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';
import {IParamGetCommunities} from '~/interfaces/IGroup';
import appConfig from '~/configs/appConfig';
import {mapItems} from '../../helper/mapper';

export default function* getDiscoverCommunities({
  payload,
}: {
  type: string;
  payload: any;
}): any {
  try {
    const {groups} = yield select();
    const {list, items, canLoadMore} = groups.discoverCommunities;
    if (!canLoadMore) return;

    yield put(groupsActions.setDiscoverCommunities({loading: true}));
    const params: IParamGetCommunities = {
      limit: appConfig.recordsPerPage,
      offset: list.length,
    };
    const response = yield call(
      groupsDataHelper.getDiscoverCommunities,
      params,
    );

    const respData = response?.data;
    if (respData) {
      const newIds = respData.map((item: any) => item.id);
      const newItems = mapItems(respData);

      const newData = {
        loading: false,
        canLoadMore: newIds.length === appConfig.recordsPerPage,
        list: [...list, ...newIds],
        items: {...items, ...newItems},
      };
      yield put(groupsActions.setDiscoverCommunities(newData));
    }
  } catch (err) {
    console.log('\x1b[33m', 'editGroupDetail : error', err, '\x1b[0m');
    yield put(groupsActions.setDiscoverCommunities({loading: false}));
    yield showError(err);
  }
}
