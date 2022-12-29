import groupApi from '~/api/GroupApi';
import { IToastMessage } from '~/interfaces/common';
import { IPayloadGroupSchemeAssignments } from '~/interfaces/IGroup';
import showToastError from '~/store/helper/showToastError';
import IPermissionSchemeState from '../Interface';
import useModalStore from '~/store/modal';

const assignSchemesToGroups = (set, get) => async (payload: IPayloadGroupSchemeAssignments) => {
  const { communityId, data, currentAssignments } = payload || {};
  const permissionSchemeData: IPermissionSchemeState = get();
  const { actions } = permissionSchemeData;
  try {
    if (!communityId || !data) {
      console.warn('\x1b[31m🐣️ assignSchemesToGroups invalid params\x1b[0m');
      return;
    }

    actions.setGroupSchemeAssigning({
      loading: true,
      data,
      currentAssignments,
    });

    const response = await groupApi.assignSchemesToGroups(payload);

    if (response?.data) {
      actions.setGroupSchemeAssigning({
        loading: false,
        currentAssignments,
      });
      actions.getSchemes({ communityId, isRefreshing: true });
      actions.getGroupSchemeAssignments({ communityId, showLoading: false });

      const toastMessage: IToastMessage = {
        content: response.meta?.message || 'Success',
      };
      useModalStore.getState().actions.showToast(toastMessage);
    } else {
      actions.setGroupSchemeAssigning({
        loading: false,
        data,
        currentAssignments,
      });

      showToastError(response);
    }
  } catch (error) {
    console.error('assignSchemesToGroups error:', error);

    actions.setGroupSchemeAssigning({
      loading: false,
      data,
      currentAssignments,
    });

    showToastError(error);
  }
};

export default assignSchemesToGroups;
