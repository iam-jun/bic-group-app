import groupApi from '~/api/GroupApi';
import APIErrorCode from '~/constants/apiErrorCode';
import { IPayloadPutGroupStructureMoveToTarget } from '~/interfaces/IGroup';
import { withNavigation } from '~/router/helper';
import { rootNavigationRef } from '~/router/refs';
import { timeOut } from '~/utils/common';
import IGroupStructureState from '../Interface';
import { IToastMessage } from '~/interfaces/common';
import showToastError from '~/store/helper/showToastError';
import showToast from '~/store/helper/showToast';

const navigation = withNavigation(rootNavigationRef);

const putGroupStructureMoveToTarget = (set, get) => async (payload: IPayloadPutGroupStructureMoveToTarget) => {
  const { communityId, moveId, targetId } = payload;
  const data: IGroupStructureState = get();
  const { move, actions } = data || {};
  const { targetGroups, movingGroup } = move || {};
  try {
    set((state: IGroupStructureState) => {
      state.move.loading = true;
      state.move.targetGroups = targetGroups;
      state.move.movingGroup = movingGroup;
    }, 'putGroupStructureMoveToTarget');

    const response = await groupApi.putGroupStructureMoveToTarget(communityId,
      moveId,
      targetId);

    if (response?.code === APIErrorCode.Common.SUCCESS) {
      actions.getGroupStructureCommunityTree({
        communityId,
        showLoading: false,
      });
      timeOut(600);
      set((state: IGroupStructureState) => {
        state.move.loading = false;
      }, 'putGroupStructureMoveToTargetSuccess');

      navigation.goBack();

      const toastMessage: IToastMessage = {
        content: 'communities:group_structure:text_move_success',
      };
      showToast(toastMessage);
    } else {
      set((state: IGroupStructureState) => {
        state.move.loading = false;
      }, 'putGroupStructureMoveToTargetError');
      showToastError(response);
    }
  } catch (e) {
    set((state: IGroupStructureState) => {
      state.move.loading = false;
      state.move.targetGroups = targetGroups;
      state.move.movingGroup = movingGroup;
    }, 'putGroupStructureMoveToTargetError');
    console.error('\x1b[31m🐣️ action putGroupStructureMoveToTarget error: ', e, '\x1b[0m');
    showToastError(e);
  }
};

export default putGroupStructureMoveToTarget;
