import {call, put, select} from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import {ICommunity} from '~/interfaces/ICommunity';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import {mapItems} from '../../helper/mapper';
import groupsActions from '../actions';

export default function* getCommunitySearch({
  payload,
}: {
  type: string;
  payload: {key: string; isLoadMore?: boolean};
}) {
  const {key, isLoadMore} = payload || {};
  if (!key?.trim?.()) {
    yield put(
      groupsActions.setCommunitySearch({
        loading: false,
        ids: [],
        items: {},
        key: '',
      }),
    );
    return;
  }
  try {
    if (!isLoadMore) {
      yield put(groupsActions.setCommunitySearch({loading: true, key}));
    }

    const {groups} = yield select();
    const {ids, items} = groups.communitySearch;

    // @ts-ignore
    const data = yield call(groupsDataHelper.getCommunities, {
      key,
      offset: isLoadMore ? ids.length : 0,
      limit: appConfig.recordsPerPage,
    });

    const newIds = data.map((item: ICommunity) => item.id);
    const newItems = mapItems(data);

    yield put(
      groupsActions.setCommunitySearch({
        loading: false,
        ids: isLoadMore ? [...ids, ...newIds] : [...newIds],
        items: isLoadMore ? {...items, ...newItems} : {...newItems},
        canLoadMore: newIds.length === appConfig.recordsPerPage,
      }),
    );
  } catch (err) {
    console.log('getCommunitySearch error:', err);
    yield call(showError, err);
  }
}
