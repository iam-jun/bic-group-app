import {call, put, select} from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import memberRequestStatus from '~/constants/memberRequestStatus';
import {IJoiningMember} from '~/interfaces/IGroup';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import {mapItems} from '../../helper/mapper';
import groupsActions from '../actions';

export default function* getGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: number; params?: any};
}) {
  try {
    const {groups} = yield select();

    const {groupId, params} = payload;
    const {data, canLoadMore, items} = groups.pendingMemberRequests || {};
    yield put(
      groupsActions.setGroupMemberRequests({loading: data.length === 0}),
    );

    if (!canLoadMore) return;

    // @ts-ignore
    const response = yield call(
      groupsDataHelper.getGroupMemberRequests,
      groupId,
      {
        offset: data.length,
        limit: appConfig.recordsPerPage,
        key: memberRequestStatus.WAITING,
        ...params,
      },
    );

    const requestIds = response?.data.map((item: IJoiningMember) => item.id);
    const requestItems = mapItems(response?.data);

    yield put(
      groupsActions.setGroupMemberRequests({
        loading: false,
        canLoadMore: requestIds.length === appConfig.recordsPerPage,
        data: [...data, ...requestIds],
        items: {...items, ...requestItems},
      }),
    );
  } catch (err) {
    console.log('getGroupMemberRequests: ', err);
    yield showError(err);
  }
}
