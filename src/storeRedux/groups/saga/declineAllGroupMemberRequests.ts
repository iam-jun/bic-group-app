import { call } from 'redux-saga/effects';

import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '../../../api/GroupApi';

export default function* declineAllGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: string; callback?: () => void};
}) {
  const { groupId } = payload;
  try {
    yield call(
      groupApi.declineAllGroupMemberRequests, groupId,
    );
  } catch (err: any) {
    console.error('declineAllGroupMemberRequests: ', err);

    yield call(showError, err);
  }
}
