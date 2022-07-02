import {call} from 'redux-saga/effects';

import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';

export default function* putGroupStructureCollapseStatus({
  payload,
}: {
  type: string;
  payload: {communityId: number; groupId: number; isCollapse: boolean};
}): any {
  const {communityId, groupId, isCollapse} = payload || {};
  try {
    yield call(
      groupsDataHelper.putGroupStructureCollapseStatus,
      communityId,
      groupId,
      isCollapse,
    );
  } catch (err: any) {
    console.log('putGroupStructureMoveToTarget error:', err);
    yield call(showError, err);
  }
}
