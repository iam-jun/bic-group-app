import { call, put, select } from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import memberRequestStatus from '~/constants/memberRequestStatus';
import { IJoiningMember } from '~/interfaces/IGroup';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import { mapItems } from '../../helper/mapper';
import groupsActions from '../actions';

export default function* getGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: number; isRefreshing?: boolean; params?: any};
}) {
  try {
    const { groups } = yield select();

    const { groupId, isRefreshing, params } = payload;
    const { ids, canLoadMore, items } = groups.groupMemberRequests || {};

    yield put(
      groupsActions.setGroupMemberRequests({
        loading: isRefreshing ? true : ids.length === 0,
      }),
    );

    if (!isRefreshing && !canLoadMore) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = yield call(
      groupsDataHelper.getGroupMemberRequests,
      groupId,
      {
        offset: isRefreshing ? 0 : ids.length,
        limit: appConfig.recordsPerPage,
        key: memberRequestStatus.WAITING,
        ...params,
      },
    );

    const requestIds = response.data.map((item: IJoiningMember) => item.id);
    const requestItems = mapItems(response.data);

    yield put(
      groupsActions.setGroupMemberRequests({
        total: response?.meta?.total,
        loading: false,
        canLoadMore: requestIds.length === appConfig.recordsPerPage,
        ids: isRefreshing ? [...requestIds] : [...ids, ...requestIds],
        items: isRefreshing ? { ...requestItems } : { ...items, ...requestItems },
      }),
    );
  } catch (err) {
    console.error('getGroupMemberRequests: ', err);
    yield call(showError, err);
  }
}
