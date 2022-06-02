import {call, put, select} from 'redux-saga/effects';
import appConfig from '~/configs/appConfig';
import memberRequestStatus from '~/constants/memberRequestStatus';
import {IJoiningMember} from '~/interfaces/IGroup';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import {mapItems} from '../../helper/mapper';
import groupsActions from '../actions';

export default function* getCommunityMemberRequests({
  payload,
}: {
  type: string;
  payload: {communityId: number; params?: any};
}) {
  try {
    const {groups} = yield select();

    const {communityId, params} = payload;
    const {ids, items, canLoadMore} = groups.communityMemberRequests || {};
    yield put(
      groupsActions.setCommunityMemberRequests({loading: ids.length === 0}),
    );

    if (!canLoadMore) return;

    // @ts-ignore
    const response = yield groupsDataHelper.getCommunityMemberRequests(
      communityId,
      {
        offset: ids.length,
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
      ids: [...ids, ...requestIds],
      items: {
        ...items,
        ...requestItems,
      },
    };

    yield put(groupsActions.setCommunityMemberRequests(newData));
  } catch (err) {
    console.log('getMemberRequests: ', err);
    yield call(showError, err);
  }
}
