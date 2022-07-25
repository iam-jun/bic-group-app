import { call } from 'redux-saga/effects';

import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '../../helper/GroupsDataHelper';

export default function* declineAllGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: number; callback?: () => void};
}) {
  const { groupId } = payload;
  try {
    yield call(groupsDataHelper.declineAllGroupMemberRequests, groupId);
  } catch (err: any) {
    console.log('declineAllGroupMemberRequests: ', err);

    yield call(showError, err);
  }
}
