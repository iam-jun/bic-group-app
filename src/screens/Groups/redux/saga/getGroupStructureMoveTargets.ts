import {put, call, select} from 'redux-saga/effects';

import groupsActions from '../actions';
import groupsDataHelper from '../../helper/GroupsDataHelper';
import showError from '~/store/commonSaga/showError';

export default function* getGroupStructureMoveTargets({
  payload,
}: {
  type: string;
  payload: {
    communityId: string;
    groupId: string;
    key?: string;
  };
}): any {
  const {communityId, groupId, key} = payload || {};
  const {targetGroups, movingGroup} =
    (yield select(state => state.groups?.groupStructure?.move)) || {};
  try {
    yield put(
      groupsActions.setGroupStructureMove({
        loading: true,
        key,
        targetGroups,
        movingGroup,
      }),
    );

    const response = yield call(
      groupsDataHelper.getCommunityStructureMoveTargets,
      communityId,
      groupId,
      key,
    );

    if (response?.data) {
      const newTargetGroups: any = response.data?.target_groups || {};
      const newMovingGroup = response.data?.moving_group || {};

      yield put(
        groupsActions.setGroupStructureMove({
          loading: false,
          key,
          targetGroups: newTargetGroups,
          movingGroup: newMovingGroup,
        }),
      );
    } else {
      yield put(
        groupsActions.setGroupStructureMove({
          loading: false,
          key,
          targetGroups,
          movingGroup,
        }),
      );
    }
  } catch (err) {
    yield put(
      groupsActions.setGroupStructureMove({
        loading: true,
        key,
        targetGroups,
        movingGroup,
      }),
    );
    yield showError(err);
  }
}
