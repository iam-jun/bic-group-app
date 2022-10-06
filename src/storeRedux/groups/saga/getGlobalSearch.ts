import { call, put, select } from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import { ICommunity } from '~/interfaces/ICommunity';
import { isGroup } from '~/screens/groups/helper';
import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '../../../api/GroupApi';
import { mapItems } from '~/screens/groups/helper/mapper';
import groupsActions from '../actions';

export default function* getGlobalSearch({
  payload,
}: {
  type: string;
  payload: string;
}) {
  try {
    const { groups } = yield select();
    const { canLoadMore, ids, items } = groups.globalSearch;

    yield put(groupsActions.setGlobalSearch({ loading: ids.length === 0 }));

    if (!canLoadMore) return;

    const response = yield call(groupApi.searchGlobal, {
      limit: appConfig.recordsPerPage,
      offset: ids.length,
      key: payload,
    });

    const results = response.data.map((item:any) => ({
      ...item,
      id: isGroup(item.level) ? item.id : item.community.id,
    }));
    const newIds = results.map((item: ICommunity) => item.id);
    const newItems = mapItems(results);

    yield put(groupsActions.setGlobalSearch({
      loading: false,
      canLoadMore: newIds.length === appConfig.recordsPerPage,
      ids: [...ids, ...newIds],
      items: { ...items, ...newItems },
    }));
  } catch (err) {
    console.error('getGlobalSearch error:', err);
    yield put(groupsActions.setGlobalSearch({ loading: false }));
    yield showError(err);
  }
}
