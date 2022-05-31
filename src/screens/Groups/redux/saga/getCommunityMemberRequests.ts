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
    const {data, items, canLoadMore} = groups.communityMemberRequests || {};
    yield put(
      groupsActions.setCommunityMemberRequests({loading: data.length === 0}),
    );

    if (!canLoadMore) return;

    // @ts-ignore
    const response = yield groupsDataHelper.getCommunityMemberRequests(
      communityId,
      {
        offset: data.length,
        limit: appConfig.recordsPerPage,
        key: memberRequestStatus.WAITING,
        ...params,
      },
    );

    const requestIds = response.map((item: IJoiningMember) => item.id);
    const requestItems = mapItems(response);

    const newData = {
      loading: false,
      canLoadMore: requestIds.length === appConfig.recordsPerPage,
      data: [...data, ...requestIds],
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
