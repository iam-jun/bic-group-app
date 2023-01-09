import { call } from 'redux-saga/effects';

import groupApi from '~/api/GroupApi';
import showToastSuccess from '~/store/helper/showToastSuccess';
import showToastError from '~/store/helper/showToastError';

export default function* declineAllGroupMemberRequests({
  payload,
}: {
  type: string;
  payload: {groupId: string; total: number; callback?: () => void};
}) {
  const { groupId } = payload;
  try {
    const response = yield call(groupApi.declineAllGroupMemberRequests, groupId);

    showToastSuccess(response);
  } catch (err: any) {
    console.error('declineAllGroupMemberRequests: ', err);

    showToastError(err);
  }
}
