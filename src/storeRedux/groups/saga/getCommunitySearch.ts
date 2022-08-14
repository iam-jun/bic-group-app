import { call, put, select } from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import { ICommunity, IParamGetCommunities } from '~/interfaces/ICommunity';
import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '../../../api/GroupApi';
import { mapItems } from '../../../screens/Groups/helper/mapper';
import groupsActions from '../actions';

export default function* getCommunitySearch({
  payload,
}: {
  type: string;
  payload: IParamGetCommunities;
}) {
  try {
    const { groups } = yield select();
    const { canLoadMore, ids, items } = groups.communitySearch;

    yield put(groupsActions.setCommunitySearch({ loading: ids.length === 0 }));

    if (!canLoadMore) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = yield call(groupApi.getCommunities, {
      limit: appConfig.recordsPerPage,
      offset: ids.length,
      ...payload,
    });

    const communities = response.data;
    const newIds = communities.map((item: ICommunity) => item.id);
    const newItems = mapItems(communities);

    yield put(groupsActions.setCommunitySearch({
      loading: false,
      canLoadMore: newIds.length === appConfig.recordsPerPage,
      ids: [...ids, ...newIds],
      items: { ...items, ...newItems },
    }));
  } catch (err) {
    console.error('getCommunitySearch error:', err);
    yield put(groupsActions.setCommunitySearch({ loading: false }));
    yield showError(err);
  }
}
