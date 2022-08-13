import { call, put, select } from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import memberRequestStatus from '~/constants/memberRequestStatus';
import { IJoiningMember } from '~/interfaces/IGroup';
import showError from '~/storeRedux/commonSaga/showError';
import groupsDataHelper from '../../../screens/Groups/helper/GroupsDataHelper';
import { mapItems } from '../../../screens/Groups/helper/mapper';
import groupsActions from '../actions';

export default function* getCommunityMemberRequests({
  payload,
}: {
  type: string;
  payload: {communityId: string; isRefreshing?: boolean; params?: any};
}) {
  try {
    const { groups } = yield select();

    const { communityId, isRefreshing, params } = payload;
    const { ids, items, canLoadMore } = groups.communityMemberRequests || {};

    yield put(groupsActions.setCommunityMemberRequests({
      loading: isRefreshing ? true : ids.length === 0,
    }));

    if (!isRefreshing && !canLoadMore) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = yield call(
      groupsDataHelper.getCommunityMemberRequests,
      communityId,
      {
        offset: isRefreshing ? 0 : ids.length,
        limit: appConfig.recordsPerPage,
        key: memberRequestStatus.WAITING,
        ...params,
      },
    );

    const requestIds = response.data.map((item: IJoiningMember) => item.id);
    const requestItems = mapItems(response.data);

    const newData = {
      total: response?.meta?.total,
      loading: false,
      canLoadMore: requestIds.length === appConfig.recordsPerPage,
      ids: isRefreshing ? [...requestIds] : [...ids, ...requestIds],
      items: isRefreshing ? { ...requestItems } : { ...items, ...requestItems },
    };

    yield put(groupsActions.setCommunityMemberRequests(newData));
  } catch (err) {
    console.error(
      'getCommunityMemberRequests: ', err,
    );
    yield call(
      showError, err,
    );
  }
}
