import {call, put} from 'redux-saga/effects';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import groupsActions from '../actions';

export default function* declineAllGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: number; callback?: () => void};
}) {
  const {groupId, callback} = payload;
  try {
    yield call(groupsDataHelper.declineAllGroupMemberRequests, groupId);
    yield put(groupsActions.getGroupDetail(groupId));

    if (callback) callback();
  } catch (err: any) {
    console.log('declineAllGroupMemberRequests: ', err);

    yield call(showError, err);
  }
}
