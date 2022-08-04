import { call } from 'redux-saga/effects';

import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '../../helper/GroupsDataHelper';

export default function* declineAllGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: string; callback?: () => void};
}) {
  const { groupId } = payload;
  try {
    yield call(
      groupsDataHelper.declineAllGroupMemberRequests, groupId,
    );
  } catch (err: any) {
    console.error('declineAllGroupMemberRequests: ', err);

    yield call(showError, err);
  }
}
