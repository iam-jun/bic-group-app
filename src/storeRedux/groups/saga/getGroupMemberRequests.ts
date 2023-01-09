import { call, put, select } from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import memberRequestStatus from '~/constants/memberRequestStatus';
import { IJoiningMember } from '~/interfaces/IGroup';
import groupApi from '../../../api/GroupApi';
import { mapItems } from '~/screens/groups/helper/mapper';
import groupsActions from '../actions';
import showToastError from '~/store/helper/showToastError';

export default function* getGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: string; isRefreshing?: boolean; params?: any};
}) {
  try {
    const { groups } = yield select();

    const { groupId, isRefreshing, params } = payload;
    const { ids, canLoadMore, items } = groups.groupMemberRequests || {};

    yield put(groupsActions.setGroupMemberRequests({
      loading: isRefreshing ? true : ids.length === 0,
    }));

    if (!isRefreshing && !canLoadMore) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = yield call(
      groupApi.getGroupMemberRequests,
      groupId,
      {
        offset: isRefreshing ? 0 : ids.length,
        limit: appConfig.recordsPerPage,
        key: memberRequestStatus.WAITING,
        ...params,
      },
    );

    const { data } = response;
    const requestIds = data.map((item: IJoiningMember) => item.id);
    const requestItems = mapItems(data);

    yield put(groupsActions.setGroupMemberRequests({
      total: response?.meta?.total,
      loading: false,
      canLoadMore: !!response?.meta?.hasNextPage,
      ids: isRefreshing ? [...requestIds] : [...ids, ...requestIds],
      items: isRefreshing ? { ...requestItems } : { ...items, ...requestItems },
    }));
  } catch (err) {
    console.error(
      'getGroupMemberRequests: ', err,
    );
    showToastError(err);
  }
}
