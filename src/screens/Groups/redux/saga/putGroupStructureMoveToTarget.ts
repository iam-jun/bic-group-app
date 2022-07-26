import { put, call, select } from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { IToastMessage } from '~/interfaces/common';
import modalActions from '~/store/modal/actions';
import { timeOut } from '~/utils/common';
import API_ERROR_CODE from '~/constants/apiErrorCode';

const navigation = withNavigation(rootNavigationRef);

export default function* putGroupStructureMoveToTarget({
  payload,
}: {
  type: string;
  payload: {communityId: string; moveId: string; targetId: string};
}): any {
  const { communityId, moveId, targetId } = payload || {};
  const { targetGroups, movingGroup, key } = (yield select((state) => state.groups?.groupStructure?.move)) || {};
  try {
    yield put(
      actions.setGroupStructureMove({
        loading: true,
        key,
        targetGroups,
        movingGroup,
      }),
    );

    const response = yield call(
      groupsDataHelper.putGroupStructureMoveToTarget,
      communityId,
      moveId,
      targetId,
    );
    if (response?.code === API_ERROR_CODE.COMMON.SUCCESS) {
      yield put(
        actions.getGroupStructureCommunityTree({
          communityId,
          showLoading: false,
        }),
      );
      yield timeOut(600); // wait for refresh group tree=
      yield put(actions.setGroupStructureMove({ loading: false }));
      navigation.goBack();
      const toastMessage: IToastMessage = {
        content: 'communities:group_structure:text_move_success',
        props: {
          textProps: { useI18n: true },
          type: 'success',
        },
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
    } else {
      yield put(
        actions.setGroupStructureMove({
          loading: false,
          key,
          targetGroups,
          movingGroup,
        }),
      );
      yield call(showError, response);
    }
  } catch (err: any) {
    yield put(
      actions.setGroupStructureMove({
        loading: true,
        key,
        targetGroups,
        movingGroup,
      }),
    );
    console.error('putGroupStructureMoveToTarget error:', err);
    yield call(showError, err);
  }
}
