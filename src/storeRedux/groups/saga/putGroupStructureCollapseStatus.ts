import { call } from 'redux-saga/effects';

import showError from '~/storeRedux/commonSaga/showError';
import groupApi from '~/api/GroupApi';

export default function* putGroupStructureCollapseStatus({
  payload,
}: {
  type: string;
  payload: {communityId: string; groupId: string; isCollapse: boolean};
}): any {
  const { communityId, groupId, isCollapse } = payload || {};
  try {
    yield call(
      groupApi.putGroupStructureCollapseStatus,
      communityId,
      groupId,
      isCollapse,
    );
  } catch (err: any) {
    console.error(
      'putGroupStructureMoveToTarget error:', err,
    );
    yield call(
      showError, err,
    );
  }
}
