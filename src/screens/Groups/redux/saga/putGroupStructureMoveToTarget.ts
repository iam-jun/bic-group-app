import {put, call, select} from 'redux-saga/effects';

import actions from '../actions';
import showError from '~/store/commonSaga/showError';
import groupsDataHelper from '~/screens/Groups/helper/GroupsDataHelper';
import {withNavigation} from '~/router/helper';
import {rootNavigationRef} from '~/router/navigator/refs';
import {IToastMessage} from '~/interfaces/common';
import modalActions from '~/store/modal/actions';
import {timeOut} from '~/utils/common';
import groupsActions from '../actions';

const navigation = withNavigation(rootNavigationRef);

export default function* putGroupStructureMoveToTarget({
  payload,
}: {
  type: string;
  payload: {communityId: number; moveId: number; targetId: number};
}): any {
  const {communityId, moveId, targetId} = payload || {};
  const {targetGroups, movingGroup, key} =
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
      groupsDataHelper.putGroupStructureMoveToTarget,
      communityId,
      moveId,
      targetId,
    );
    if (response?.data) {
      yield put(
        actions.getGroupStructureCommunityTree({
          communityId,
          showLoading: false,
        }),
      );
      yield timeOut(600); //wait for refresh group tree=
      yield put(actions.setGroupStructureMove({loading: false}));
      navigation.goBack();
      const toastMessage: IToastMessage = {
        content: 'communities:group_structure:text_move_success',
        props: {
          textProps: {useI18n: true},
          type: 'success',
        },
      };
      yield put(modalActions.showHideToastMessage(toastMessage));
    } else {
      yield put(
        groupsActions.setGroupStructureMove({
          loading: true,
          key,
          targetGroups,
          movingGroup,
        }),
      );
      yield call(showError, response);
    }
  } catch (err: any) {
    yield put(
      groupsActions.setGroupStructureMove({
        loading: true,
        key,
        targetGroups,
        movingGroup,
      }),
    );
    console.log('putGroupStructureMoveToTarget error:', err);
    yield call(showError, err);
  }
}
