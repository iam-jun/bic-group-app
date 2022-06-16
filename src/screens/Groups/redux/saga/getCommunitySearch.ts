import {call, put, select} from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import {ICommunity, IParamGetCommunities} from '~/interfaces/ICommunity';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import {mapItems} from '../../helper/mapper';
import groupsActions from '../actions';

export default function* getCommunitySearch({
  payload,
}: {
  type: string;
  payload: IParamGetCommunities;
}) {
  try {
    const {groups} = yield select();
    const {canLoadMore, ids, items} = groups.communitySearch;

    yield put(groupsActions.setCommunitySearch({loading: ids.length === 0}));

    if (!canLoadMore) return;

    // @ts-ignore
    const data = yield call(groupsDataHelper.getCommunities, {
      limit: appConfig.recordsPerPage,
      offset: ids.length,
      ...payload,
    });

    const newIds = data.map((item: ICommunity) => item.id);
    const newItems = mapItems(data);

    yield put(
      groupsActions.setCommunitySearch({
        loading: false,
        canLoadMore: newIds.length === appConfig.recordsPerPage,
        ids: [...ids, ...newIds],
        items: {...items, ...newItems},
      }),
    );
  } catch (err) {
    console.log('getCommunitySearch error:', err);
    yield call(showError, err);
  }
}
